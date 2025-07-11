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
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";

const { Title } = Typography;

// IPFS URL을 적절한 게이트웨이 URL로 바꿔주는 함수
const getValidImageUrl = (url) => {
  if (!url)
    return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image"; // 기본 대체 이미지
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

const CouponsManage = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingNft, setEditingNft] = useState(null);
  const [editForm] = Form.useForm();

  const [isIssueModalVisible, setIssueModalVisible] = useState(false);
  const [issueForm] = Form.useForm();
  const [issueNftMetadataId, setIssueNftMetadataId] = useState(null);

  const fetchNfts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/nft/metadata");
      setNfts(res.data);
    } catch (error) {
      message.error("NFT 불러오기 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, []);

  const openEditModal = (nft) => {
    setEditingNft(nft);
    editForm.setFieldsValue({
      title: nft.title,
      imageUrl: nft.imageUrl,
      pointValue: nft.pointValue,
    });
    setEditModalVisible(true);
  };

  const onEditFinish = async (values) => {
    try {
      await axios.put(`/api/nft/metadata/${editingNft.id}`, values);
      message.success("수정 성공");
      setEditModalVisible(false);
      setEditingNft(null);
      fetchNfts();
    } catch (error) {
      message.error("수정 실패: " + error.message);
    }
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`/api/nft/metadata/${id}`);
      message.success("삭제 성공");
      fetchNfts();
    } catch (error) {
      // message.error("삭제 실패: " + error.message);
      message.error("nft 사용 전입니다." );
    }
  };

  const syncNftsFromBlockchain = async () => {
    const contractAddress = "0x3c1011554E887c1a0CFD5e93535958b03b140c09";
    const walletAddress = "0x59ae01d894f9B0a73EDA9427E5499Ee80De329Cf";
    try {
      await axios.post(
        `/api/nft/sync-tokens?contractAddress=${contractAddress}&walletAddress=${walletAddress}`
      );
      message.success("NFT 동기화 완료");
      fetchNfts();
    } catch (err) {
      message.error("동기화 실패: " + err.message);
    }
  };

  const openIssueModal = (nftId) => {
    setIssueNftMetadataId(nftId);
    issueForm.resetFields();
    setIssueModalVisible(true);
  };

  const onIssueFinish = async (values) => {
    const { issuedReason, userId } = values;
    if (!userId) {
      message.error("받는 사용자 ID를 입력하세요");
      return;
    }
    try {
      await axios.post(`/api/admin/nft/issue-to-member`, null, {
        params: {
          nftMetadataId: issueNftMetadataId,
          issuedReason,
          id: userId, // 백엔드의 Long id 파라미터에 맞게
        },
      });

      // 상태 업데이트: 발급된 NFT의 issued = true 처리
      setNfts((prevNfts) =>
        prevNfts.map((nft) =>
          nft.id === issueNftMetadataId ? { ...nft, issued: true } : nft
        )
      );

      message.success("NFT 발급 완료");
      setIssueModalVisible(false);
      setIssueNftMetadataId(null);
    } catch (error) {
      message.error("NFT 발급 실패: " + error.message);
    }
  };

  return (
    <MypageLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>NFT 쿠폰 리스트</Title>

        {/* 버튼을 오른쪽 끝에 정렬 */}
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={syncNftsFromBlockchain}
          >
            NFT 동기화
          </Button>
        </div>

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
                      alt={nft.title}
                      src={getValidImageUrl(nft.imageUrl)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                      }}
                      style={{ width: "100%", height: 200, objectFit: "contain" }}
                    />
                  }
                  actions={[
                    nft.issued ? (
                      <Button type="primary" disabled>
                        발급완료
                      </Button>
                    ) : (
                      <Button type="link" onClick={() => openIssueModal(nft.id)}>
                        NFT 발급
                      </Button>
                    ),
                    <Button type="link" onClick={() => openEditModal(nft)}>
                      수정
                    </Button>,
                    <Popconfirm
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

        {/* 수정 모달 */}
        <Modal
          title="NFT 쿠폰 수정"
          visible={isEditModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingNft(null);
            editForm.resetFields();
          }}
          onOk={() => editForm.submit()}
          okText="수정"
        >
          <Form form={editForm} layout="vertical" onFinish={onEditFinish}>
            <Form.Item label="제목" name="title">
              <Input disabled />
            </Form.Item>
            <Form.Item label="이미지 URL" name="imageUrl">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="포인트 값"
              name="pointValue"
              rules={[{ required: true, message: "포인트 값을 입력하세요" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* 발급 모달 */}
        <Modal
          title="NFT 발급"
          visible={isIssueModalVisible}
          onCancel={() => {
            setIssueModalVisible(false);
            setIssueNftMetadataId(null);
            issueForm.resetFields();
          }}
          onOk={() => issueForm.submit()}
          okText="발급하기"
        >
          <Form form={issueForm} layout="vertical" onFinish={onIssueFinish}>
            <Form.Item
              label="발급 이유"
              name="issuedReason"
              rules={[{ required: true, message: "발급 이유를 입력하세요" }]}
            >
              <Input.TextArea placeholder="예: 리뷰 감사 선물" />
            </Form.Item>
            <Form.Item
              label="받는 사용자 ID (숫자형)"
              name="userId"
              rules={[{ required: true, message: "사용자 ID를 입력하세요" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="예: 1" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MypageLayout>
  );
};

export default CouponsManage;
