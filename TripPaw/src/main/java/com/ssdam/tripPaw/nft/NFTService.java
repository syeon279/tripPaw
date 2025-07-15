package com.ssdam.tripPaw.nft;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.utils.Numeric;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssdam.tripPaw.domain.NftMetadata;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NFTService {

    private final Web3j web3j;
    private final NftMetadataMapper nftMetadataMapper;
    private final MemberNftMapper memberNftMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 블록체인에서 보유 NFT 조회
    public List<NFTDto> getNFTs(String contractAddress, String walletAddress) throws Exception {
        Function balanceOf = new Function(
                "balanceOf",
                List.of(new Address(walletAddress)),
                List.of(new TypeReference<Uint256>() {})
        );
        String encoded = FunctionEncoder.encode(balanceOf);
        EthCall call = web3j.ethCall(
                Transaction.createEthCallTransaction(walletAddress, contractAddress, encoded),
                DefaultBlockParameterName.LATEST
        ).send();

        BigInteger balance = Numeric.decodeQuantity(call.getValue());
        List<NFTDto> result = new ArrayList<>();

        for (int i = 0; i < balance.intValue(); i++) {
            // 1. tokenOfOwnerByIndex
            Function tokenOfOwnerByIndex = new Function(
                    "tokenOfOwnerByIndex",
                    List.of(new Address(walletAddress), new Uint256(i)),
                    List.of(new TypeReference<Uint256>() {})
            );
            EthCall indexCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(walletAddress, contractAddress, FunctionEncoder.encode(tokenOfOwnerByIndex)),
                    DefaultBlockParameterName.LATEST
            ).send();

            BigInteger tokenId = Numeric.decodeQuantity(indexCall.getValue());

            // 2. tokenURI
            Function tokenURI = new Function(
                    "tokenURI",
                    List.of(new Uint256(tokenId)),
                    List.of(new TypeReference<Utf8String>() {})
            );
            EthCall uriCall = web3j.ethCall(
                    Transaction.createEthCallTransaction(walletAddress, contractAddress, FunctionEncoder.encode(tokenURI)),
                    DefaultBlockParameterName.LATEST
            ).send();

            String uriHex = uriCall.getValue();
            byte[] bytes = Numeric.hexStringToByteArray(uriHex);
            String rawUri = new String(bytes, StandardCharsets.UTF_8).trim().replaceAll("\u0000", "");
            if (rawUri.startsWith("I")) {
                rawUri = rawUri.substring(1);
            }

            // IPFS to HTTPS 변환
            String metadataUrl = rawUri.replace("ipfs://", "https://ipfs.io/ipfs/");

            // ** 메타데이터 JSON 가져와서 image 필드 파싱 **
            String imageUrl = metadataUrl;  // 기본값 (혹시 실패 시)
            try {
                ResponseEntity<String> response = restTemplate.getForEntity(metadataUrl, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    String jsonString = response.getBody();
                    JsonNode root = objectMapper.readTree(jsonString);
                    if (root.has("image")) {
                        String imageIpfs = root.get("image").asText();
                        if (imageIpfs.startsWith("ipfs://")) {
                            imageUrl = imageIpfs.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
                        } else {
                            imageUrl = imageIpfs;
                        }
                    }
                }
            } catch (Exception e) {
                // JSON 파싱 실패 시 로그 기록하고 넘어감
                System.out.println("메타데이터 JSON 파싱 실패, tokenId=" + tokenId + ", url=" + metadataUrl);
                e.printStackTrace();
            }

            result.add(new NFTDto(tokenId.toString(), metadataUrl, imageUrl));
        }

        return result;
    }

    // 🔁 동기화: 블록체인에서 NFT 가져와 DB 저장/업데이트
    public List<NftMetadata> syncTokensToDb(String contractAddress, String walletAddress) throws Exception {
        List<NFTDto> nfts = getNFTs(contractAddress, walletAddress);
        List<NftMetadata> savedList = new ArrayList<>();

        for (NFTDto nft : nfts) {
            try {
                // tokenId를 Long으로 변환 (기존 값 사용)
                Long tokenId = Long.parseLong(nft.getTokenId());
                String imageUrl = nft.getPreviewURL();
                String title = "Token #" + tokenId;  // 제목 설정, 예시로 tokenId를 포함

                // DB에서 token_id로 기존 레코드 조회
                NftMetadata existing = nftMetadataMapper.findByTokenId(tokenId);
                if (existing == null) {
                    // 기존에 없으면 새로 추가
                    NftMetadata newMeta = new NftMetadata();
                    newMeta.setTokenId(tokenId);  // 반드시 token_id를 설정
                    newMeta.setTitle(title);
                    newMeta.setImageUrl(imageUrl);
                    newMeta.setPointValue(0);  // 기본 포인트값 설정
                    newMeta.setIssuedAt(LocalDateTime.now());  // 현재 시간
                    nftMetadataMapper.insert(newMeta);  // DB에 삽입
                    savedList.add(newMeta);
                } else {
                    // 기존에 있으면 업데이트
                    existing.setImageUrl(imageUrl);
                    existing.setTitle(title);
                    existing.setPointValue(0);  // 필요에 따라 업데이트할 필드 설정
                    nftMetadataMapper.update(existing);  // DB에 업데이트
                    savedList.add(existing);
                }
            } catch (Exception e) {
                // 예외 발생 시 로그 출력
                System.out.println("Error syncing NFT with tokenId: " + nft.getTokenId());
                e.printStackTrace();
                throw new RuntimeException("Failed to sync NFT: " + nft.getTokenId(), e);  // 예외 던지기
            }
        }
        return savedList;
    }

    // ✅ NFT 템플릿 + 발급 여부 반환
    public List<Map<String, Object>> getAllNftMetadata() {
        List<NftMetadata> metadataList = nftMetadataMapper.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (NftMetadata meta : metadataList) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", meta.getId());
            map.put("title", meta.getTitle());
            map.put("imageUrl", meta.getImageUrl());
            map.put("tokenId", meta.getTokenId());
            map.put("pointValue", meta.getPointValue());
            map.put("issuedAt", meta.getIssuedAt());

            // 발급 여부 조회 (member_nft 테이블에 존재 여부)
            boolean isIssued = memberNftMapper.existsByNftMetadataId(meta.getId());
            map.put("issued", isIssued);

            result.add(map);
        }

        return result;
    }

    // NFT 메타데이터 수정
    public void updateNftMetadata(Long id, Map<String, Object> updates) {
        NftMetadata nft = nftMetadataMapper.findById(id);
        if (nft == null) throw new RuntimeException("해당 NFT 없음: " + id);

        if (updates.containsKey("pointValue")) {
            nft.setPointValue((Integer) updates.get("pointValue"));
        }
        nftMetadataMapper.update(nft);
    }

    // NFT 메타데이터 삭제
    @Transactional
    public void deleteNftMetadataAndUsedCoupons(Long nftMetadataId) {
        int unusedCount = memberNftMapper.countUnusedByMetadataId(nftMetadataId);

        if (unusedCount > 0) {
            throw new IllegalStateException("사용하지 않은 쿠폰이 존재하므로 삭제할 수 없습니다.");
        }

        // soft delete 메서드 호출로 변경 (이름 맞춤)
        memberNftMapper.softDeleteUsedByNftMetadataId(nftMetadataId);

        nftMetadataMapper.delete(nftMetadataId);
    }
}
