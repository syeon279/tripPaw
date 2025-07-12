import React, { useState, useEffect } from "react";
import { Tabs, List, Avatar, Rate, Tag, Button, Image, Spin, Tooltip } from "antd";
import { EllipsisOutlined, MoreOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";
import styled from 'styled-components';
import AppLayout from "@/components/AppLayout";

const ScrollContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  overflow-y: auto;
  //border: 2px solid red;
`;
const MAX_CONTENT_LENGTH = 100;

const ReviewList = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");
  const [likeStates, setLikeStates] = useState({});
  const memberId = 1;

  useEffect(() => {
    fetchReviews(sort);
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
            renderItem={(item) => {
              console.log('리뷰 아이템:', item);
              return (
              <List.Item key={item.reviewId} style={{ borderBottom: "1px solid #eee", paddingBottom: 24 }}>
                {/* 제목 & 태그 */}
                <div 
                  style={{ fontWeight: 600, color: '#666', marginBottom: 4, cursor:'pointer'}}
                  onClick={() => router.push(`/review/tripPlan/${item.tripPlanId}`)}
                >
                  📌 여행 플랜: {item.planTitle}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    {(item.tags || []).map((tag, idx) => (
                      <Tag key={idx} color="volcano" style={{ marginBottom: 4, marginRight: 4 }}>
                        {tag}
                      </Tag>
                    ))}
                    <div style={{ fontWeight: "bold", fontSize: "16px", marginTop: 4 }}>
                      {item.title}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Rate value={item.avgRating} disabled style={{ fontSize: 16 }} />
                    <div style={{ fontSize: 13, marginTop: 2 }}>
                      평균 ★ {item.avgRating?.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* 유저 정보 & 작성일 & 별점 */}
                <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
                  <Avatar size={48} />
                  <div style={{ marginLeft: 12 }}>
                    <div style={{ fontWeight: 600 }}>{item.memberNickname}</div>
                    <Rate value={item.rating} disabled style={{ fontSize: 14 }} />
                  </div>
                </div>

                {/* 내용 */}
                <div 
                  style={{
                    marginTop: 12,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word", // <-- 이게 핵심!
                    width: "100%",           // <-- 필요시 제한
                  }}
                >
                  {getContent(item)}
                  {item.content.length > MAX_CONTENT_LENGTH && (
                    <Button type="link" size="small" icon={<EllipsisOutlined />} onClick={() => toggleContent(item.reviewId)}>
                      {expandedReviewId === item.reviewId ? "접기" : "더보기"}
                    </Button>
                  )}
                </div>

                {/* 이미지들 */}
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

                {/* 좋아요 */}
                <div style={{ marginTop: 16 }}>
                  <Button
                    block
                    type={likeStates[item.reviewId]?.liked ? "primary" : "default"}
                    onClick={() => toggleLike(item.reviewId)}
                  >
                    👍 도움이 돼요 {likeStates[item.reviewId]?.count ?? 0}
                  </Button>
                </div>
              </List.Item>
              );
            }}
          />
        )}
        </ScrollContainer>
      </div>
    </AppLayout>
  );
};
export default ReviewList;