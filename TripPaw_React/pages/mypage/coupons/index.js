import MypageLayout from "@/components/layout/MyPageLayout";
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Button,
  Modal,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import ScratchCard from "react-scratchcard";

const { Title } = Typography;

const getValidImageUrl = (url) => {
  if (!url)
    return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  }
  if (url.includes("ipfs.io")) {
    return url.replace(
      "https://ipfs.io/ipfs/",
      "https://gateway.pinata.cloud/ipfs/"
    );
  }
  return url;
};

const isUsed = (usedAt) => {
  return usedAt !== null && usedAt !== "" && usedAt !== "null" && usedAt !== undefined;
};

const Coupons = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [useModalVisible, setUseModalVisible] = useState(false);
  const [pendingUseNft, setPendingUseNft] = useState(null);
  const [isScratched, setIsScratched] = useState(false);

  const fetchNfts = async () => {
    if (!memberId) return;
    try {
      const nftRes = await axios.get(`/api/member-nft/${memberId}`);
      setNfts(nftRes.data);
    } catch (error) {
      message.error("NFT 불러오기 실패: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUserAndNfts = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get("/api/auth/check", { withCredentials: true });
        const numericId = Number(userRes.data.memberId);
        if (isNaN(numericId)) {
          message.error("memberId가 숫자가 아닙니다.");
          return;
        }
        setMemberId(numericId);
        const nftRes = await axios.get(`/api/member-nft/${numericId}`);
        setNfts(nftRes.data);
      } catch (error) {
        message.error("유저 정보 또는 NFT 불러오기 실패: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndNfts();
  }, []);

  const onUse = (nft) => {
    setPendingUseNft(nft);
    setIsScratched(false);
    setUseModalVisible(true);
  };

  const handleUseConfirm = async () => {
    if (!pendingUseNft) return;
    try {
      await axios.post(`/api/member-nft/use/${pendingUseNft.id}`);
      message.success(`${pendingUseNft.pointValue} 포인트 사용 완료`);

    // 사용한 NFT는 즉시 리스트에서 제거
    setNfts((prev) =>
      prev.filter((nft) => nft.id !== pendingUseNft.id)
    );
      setIsScratched(true);
    } catch (error) {
      message.error("사용 실패: " + error.message);
    }
  };

  const onDelete = async (nftId) => {
    try {
      await axios.delete(`/api/member-nft/${nftId}`, {
        params: { memberId },
      });
      message.success("삭제 성공");
      fetchNfts();
    } catch (error) {
      message.error("삭제 실패: " + error.message);
    }
  };

  return (
    <MypageLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>NFT 쿠폰 리스트</Title>

        {loading ? (
          <Spin size="large" />
        ) : nfts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {nfts.map((nft) => (
              <Col key={nft.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={nft.title || "NFT 이미지"}
                      src={getValidImageUrl(nft.imageUrl)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                      }}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "contain",
                      }}
                    />
                  }
                  actions={[
                    <Button
                      key="use"
                      type="link"
                      disabled={isUsed(nft.usedAt)}
                      onClick={() => onUse(nft)}
                    >
                      {isUsed(nft.usedAt) ? "사용 완료" : "사용"}
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="정말 삭제하시겠습니까?"
                      onConfirm={() => onDelete(nft.id)}
                      okText="예"
                      cancelText="아니오"
                    >
                      <Button type="link" danger>
                        삭제
                      </Button>
                    </Popconfirm>,
                  ]}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div>표시할 NFT가 없습니다.</div>
        )}

        {/* 스크래치 모달 */}
        <Modal
          title="쿠폰 스크래치"
          open={useModalVisible}
          onCancel={() => {
            setUseModalVisible(false);
            setPendingUseNft(null);
          }}
          footer={null}
        >
          <div style={{ textAlign: "center" }}>
            {pendingUseNft && (
              <ScratchCard
                key={pendingUseNft.id}
                width={300}
                height={300}
                image={getValidImageUrl(pendingUseNft.imageUrl)}
                finishPercent={50}
                onComplete={handleUseConfirm}
              >
                {!isScratched ? (
                  <div style={{ height: 300 }} />
                ) : (
                  <div style={{ padding: 16 }}>
                    <h3>🎉 축하합니다! {pendingUseNft.pointValue} 포인트 당첨!</h3>
                    <img
                      src={`https://barcode.tec-it.com/barcode.ashx?data=${pendingUseNft.barcode}&code=Code128&translate-esc=false`}
                      alt="바코드 이미지"
                      style={{ width: "80%", maxWidth: 250, marginBottom: 16 }}
                    />
                    {/* <p><strong>바코드:</strong> {pendingUseNft.barcode || "없음"}</p> */}
                    <p><strong>발급일:</strong> {pendingUseNft.issuedAt ? new Date(pendingUseNft.issuedAt).toLocaleDateString() : "정보 없음"}</p>
                    <p><strong>만료일:</strong> {pendingUseNft.dueAt ? new Date(pendingUseNft.dueAt).toLocaleDateString() : "정보 없음"}</p>
                  </div>
                )}
              </ScratchCard>
            )}
            <Button
              style={{ marginTop: 16 }}
              onClick={() => {
                setUseModalVisible(false);
                setPendingUseNft(null);
              }}
            >
              닫기
            </Button>
          </div>
        </Modal>
      </div>
    </MypageLayout>
  );
};

export default Coupons;
