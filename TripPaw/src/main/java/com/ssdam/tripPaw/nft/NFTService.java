package com.ssdam.tripPaw.nft;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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

            // IPFS to HTTPS 변환
            if (rawUri.contains("ipfs://")) {
                rawUri = rawUri.substring(rawUri.indexOf("ipfs://"));
            }
            String metadataUrl = rawUri.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");

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
            Long id = Long.parseLong(nft.getTokenId());
            String imageUrl = nft.getPreviewURL(); // 위에서 파싱한 imageUrl이 저장됨

            NftMetadata existing = nftMetadataMapper.findById(id);
            if (existing == null) {
                NftMetadata newMeta = new NftMetadata();
                newMeta.setId(id);
                newMeta.setTitle("Token #" + id);
                newMeta.setImageUrl(imageUrl); // 실제 이미지 URL 저장
                newMeta.setPointValue(0);
                nftMetadataMapper.insert(newMeta);
                savedList.add(newMeta);
            } else {
                existing.setImageUrl(imageUrl);
                nftMetadataMapper.update(existing);
                savedList.add(existing);
            }
        }
        return savedList;
    }

    // DB에서 모든 NFT 템플릿 조회
    public List<NftMetadata> getAllNftMetadata() {
        return nftMetadataMapper.findAll();
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
    public void deleteNftMetadata(Long id) {
        nftMetadataMapper.delete(id);
    }
}
