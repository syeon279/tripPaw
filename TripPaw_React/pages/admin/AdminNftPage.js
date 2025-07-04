import React, { useEffect, useState } from "react";
import axios from "axios";

const NFTAdminPage = () => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/nft/tokens", {
        params: {
          contractAddress: "0x3c1011554E887c1a0CFD5e93535958b03b140c09",
          walletAddress: "0x59ae01d894f9B0a73EDA9427E5499Ee80De329Cf",
        },
      })
      .then((res) => {
        setNfts(res.data);
      });
  }, []);

  return (
    <div>
      <h2>NFT 쿠폰 리스트</h2>
      <ul>
        {nfts.map((nft) => (
          <li key={nft.tokenId}>
            <img src={nft.previewURL} alt="NFT" width={100} />
            <p>Token ID: {nft.tokenId}</p>
            <p>URL: {nft.tokenURI}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NFTAdminPage;
