package com.ssdam.tripPaw.nft;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/*
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.utils.Numeric;
*/
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NFTService {
/*
    private final Web3j web3j;

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
            // tokenOfOwnerByIndex
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

            // tokenURI
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
            if (rawUri.contains("ipfs://")) {
                rawUri = rawUri.substring(rawUri.indexOf("ipfs://"));
            }

            result.add(new NFTDto(tokenId.toString(), rawUri, rawUri.replace("ipfs://", "https://ipfs.io/ipfs/")));
        }

        return result;
    }
    
    */
}
