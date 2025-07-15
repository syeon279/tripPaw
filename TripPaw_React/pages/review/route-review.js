import React, { useState, useEffect } from "react";
import {
  Tabs,
  List,
  Avatar,
  Rate,
  Tag,
  Button,
  Image,
  Spin,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  message
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import styled from 'styled-components';
import AppLayout from "@/components/AppLayout";

const ScrollContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
`;
const MAX_CONTENT_LENGTH = 100;

const getValidImageUrl = (url) => {
  if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://")) return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  if (url.includes("ipfs.io")) return url.replace("https://ipfs.io/ipfs/", "https://gateway.pinata.cloud/ipfs/");
  return url;
};

const ReviewList = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");
  const [likeStates, setLikeStates] = useState({});
  const memberId = 1;

  const [nfts, setNfts] = useState([]);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [selectedNftId, setSelectedNftId] = useState(null);
  const [selectedReviewUser, setSelectedReviewUser] = useState(null);
  const [issueForm] = Form.useForm();

  useEffect(() => {
    fetchReviews(sort);
    fetchNfts();
  }, [sort]);

  const fetchReviews = async (sortKey = "latest") => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/review/plan?sort=${sortKey}`);
      const reviews = response.data;
      setReviews(reviews);

      const newStates = {};
      for (let review of reviews) {
        const [likedRes, countRes] = await Promise.all([
          axios.get(`http://localhost:8080/review/${review.reviewId}/like/marked`, { params: { memberId } }),
          axios.get(`http://localhost:8080/review/${review.reviewId}/like/count`)
        ]);
        newStates[review.reviewId] = {
          liked: likedRes.data,
          count: countRes.data
        };
      }
      setLikeStates(newStates);
    } catch (err) {
      console.error("리뷰 또는 좋아요 상태 불러오기 실패", err);
    }
    setLoading(false);
  };

  const fetchNfts = async () => {
    try {
      const res = await axios.get("/api/nft/metadata");
      setNfts(res.data);
    } catch (err) {
      message.error("NFT 목록 로딩 실패");
    }
  };

  const toggleContent = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  const toggleLike = async (reviewId) => {
    const current = likeStates[reviewId];
    try {
      if (current?.liked) {
        await axios.delete(`http://localhost:8080/review/${reviewId}/like`, { params: { memberId } });
      } else {
        await axios.post(`http://localhost:8080/review/${reviewId}/like`, null, { params: { memberId } });
      }

      const [likedRes, countRes] = await Promise.all([
        axios.get(`http://localhost:8080/review/${reviewId}/like/marked`, { params: { memberId } }),
        axios.get(`http://localhost:8080/review/${reviewId}/like/count`)
      ]);
      setLikeStates({
        ...likeStates,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data
        }
      });
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };

  const openIssueModal = (nickname) => {
    setSelectedReviewUser(nickname);
    setSelectedNftId(null);
    setIssueModalVisible(true);
    issueForm.resetFields();
  };

  const onIssueFinish = async (values) => {
    const { issuedReason } = values;
    if (!selectedNftId || !selectedReviewUser) {
      message.error("NFT 및 닉네임 선택 필수");
      return;
    }

    try {
      await axios.post(`/api/admin/nft/issue-to-member`, null, {
        params: {
          nftMetadataId: selectedNftId,
          issuedReason,
          nickname: selectedReviewUser,
        },
      });
      message.success("NFT 발급 성공");
      setIssueModalVisible(false);
    } catch (err) {
      message.error("발급 실패: " + err.message);
    }
  };

  const getContent = (item) => {
    if (expandedReviewId === item.reviewId || item.content.length <= MAX_CONTENT_LENGTH) {
      return item.content;
    }
    return item.content.slice(0, MAX_CONTENT_LENGTH) + "...";
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
        <ScrollContainer>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>사용자 리뷰</h2>

          <Tabs
            activeKey={sort}
            onChange={(key) => setSort(key)}
            centered
            style={{ marginBottom: 32 }}
            items={[
              { label: "추천순", key: "recommended" },
              { label: "최신순", key: "latest" },
              { label: "높은평점순", key: "high" },
              { label: "낮은평점순", key: "low" },
            ]}
          />

          {loading ? (
            <Spin tip="리뷰 불러오는 중..." />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={reviews}
              renderItem={(item) => (
                <List.Item key={item.reviewId} style={{ borderBottom: "1px solid #eee", paddingBottom: 24 }}>
                  <div style={{ fontWeight: 600, color: '#666', marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => router.push(`/review/tripPlan/${item.tripPlanId}`)}>
                    📌 여행 플랜: {item.planTitle}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      {(item.tags || []).map((tag, idx) => (
                        <Tag key={idx} color="volcano" style={{ marginBottom: 4, marginRight: 4 }}>{tag}</Tag>
                      ))}
                      <div style={{ fontWeight: "bold", fontSize: "16px", marginTop: 4 }}>{item.title}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Rate value={item.avgRating} disabled style={{ fontSize: 16 }} />
                      <div style={{ fontSize: 13, marginTop: 2 }}>평균 ★ {item.avgRating?.toFixed(1)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
                    <Avatar size={48} />
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ fontWeight: 600 }}>{item.memberNickname}</div>
                      <Rate value={item.rating} disabled style={{ fontSize: 14 }} />
                    </div>
                  </div>

                  <div style={{ marginTop: 12, whiteSpace: "pre-wrap", wordBreak: "break-word", width: "100%" }}>
                    {getContent(item)}
                    {item.content.length > MAX_CONTENT_LENGTH && (
                      <Button type="link" size="small" icon={<EllipsisOutlined />} onClick={() => toggleContent(item.reviewId)}>
                        {expandedReviewId === item.reviewId ? "접기" : "더보기"}
                      </Button>
                    )}
                  </div>

                  {item.imageUrls && (
                    <Image.PreviewGroup>
                      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                        {item.imageUrls.split(",").map((src, idx) => (
                          <Image
                            key={idx}
                            width={120}
                            height={120}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            src={`http://localhost:8080/upload/reviews/${src}`}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <Button
                      block
                      type={likeStates[item.reviewId]?.liked ? "primary" : "default"}
                      onClick={() => toggleLike(item.reviewId)}
                    >
                      👍 도움이 돼요 {likeStates[item.reviewId]?.count ?? 0}
                    </Button>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Button block type="dashed" onClick={() => openIssueModal(item.memberNickname)}>
                      🎁 NFT 발급
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          )}
        </ScrollContainer>

        <Modal
          title="NFT 발급"
          open={issueModalVisible}
          onCancel={() => setIssueModalVisible(false)}
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

            <div style={{ marginTop: 16 }}>
              <h4>쿠폰 NFT 선택</h4>
              <Row gutter={[16, 16]}>
                {nfts.map((nft) => (
                  <Col span={8} key={nft.id}>
                    <Card
                      hoverable
                      onClick={() => setSelectedNftId(nft.id)}
                      style={{
                        border: selectedNftId === nft.id ? "2px solid #1890ff" : "1px solid #ccc",
                      }}
                      cover={
                        <img
                          alt={nft.title}
                          src={getValidImageUrl(nft.imageUrl)}
                          style={{ height: 180, objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta title={nft.title} description={`포인트: ${nft.pointValue}`} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};
export default ReviewList;
