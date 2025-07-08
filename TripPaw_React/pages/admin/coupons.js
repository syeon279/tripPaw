import AdminpageLayout from "@/components/layout/AdminpageLayout";
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

const coupons = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingNft, setEditingNft] = useState(null);
  const [form] = Form.useForm();

  // NFT 조회
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

  // 수정 모달 열기
  const openEditModal = (nft) => {
    setEditingNft(nft);
    form.setFieldsValue({
      title: nft.title,
      imageUrl: nft.imageUrl,
      pointValue: nft.pointValue,
    });
    setEditModalVisible(true);
  };

  // 수정 완료
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

  // 삭제
  const onDelete = async (id) => {
    try {
      await axios.delete(`/api/nft/metadata/${id}`);
      message.success("삭제 성공");
      fetchNfts();
    } catch (error) {
      message.error("삭제 실패: " + error.message);
    }
  };

  // NFT 동기화 버튼
  const syncNftsFromBlockchain = async () => {
    const contractAddress = "0x3c1011554E887c1a0CFD5e93535958b03b140c09"; // 실제 주소로 교체
    const walletAddress = "0x59ae01d894f9B0a73EDA9427E5499Ee80De329Cf"; // 실제 주소로 교체
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

  return (
    <AdminpageLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>NFT 쿠폰 리스트</Title>

        <Button type="primary" onClick={syncNftsFromBlockchain} style={{ marginBottom: 16 }}>
          NFT 동기화
        </Button>

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
                      src={nft.imageUrl}
                      style={{ width: "100%", height: 200, objectFit: "contain" }}
                    />
                  }
                  actions={[
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
                >
                  
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div>표시할 NFT가 없습니다.</div>
        )}

        {/* 수정 모달 */}
        <Modal
          title="NFT 쿠폰 수정"
          open={isEditModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingNft(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
          okText="수정"
        >
          <Form form={form} layout="vertical" onFinish={onEditFinish}>
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
      </div>
    </AdminpageLayout>
  );
};

export default coupons;
