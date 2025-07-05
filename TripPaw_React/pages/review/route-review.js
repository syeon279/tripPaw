import React, { useState, useEffect } from "react";
import { Tabs, List, Avatar, Rate, Tag, Button, Image, Spin } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/router";

const ReviewList = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("latest");
  const [likeStates, setLikeStates] = useState({});
  
  const memberId = 1; // TODO: 로그인 사용자 ID로 대체
  

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
          axios.get(`http://localhost:8080/review/${review.reviewId}/like/marked`, {
            params: { memberId },
          }),
          axios.get(`http://localhost:8080/review/${review.reviewId}/like/count`),
        ]);
        newStates[review.reviewId] = {
          liked: likedRes.data,
          count: countRes.data,
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
        await axios.delete(`http://localhost:8080/review/${reviewId}/like`, {
          params: { memberId },
        });
      } else {
        await axios.post(`http://localhost:8080/review/${reviewId}/like`, null, {
          params: { memberId },
        });
      }

      const [likedRes, countRes] = await Promise.all([
        axios.get(`http://localhost:8080/review/${reviewId}/like/marked`, {
          params: { memberId },
        }),
        axios.get(`http://localhost:8080/review/${reviewId}/like/count`),
      ]);
      setLikeStates({
        ...likeStates,
        [reviewId]: {
          liked: likedRes.data,
          count: countRes.data,
        },
      });
    } catch (err) {
      console.error("좋아요 처리 실패", err);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>여행 경로 리뷰</h2>

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
            <List.Item
              key={item.reviewId}
              style={{ borderBottom: "1px solid #eee", paddingBottom: 24 }}
            >
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 4 }}>
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

              <hr />

              <div style={{ display: "flex", alignItems: "flex-start", marginTop: 16 }}>
                <Avatar size={48} />
                <div style={{ marginLeft: 12, flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>{item.memberNickname}</span>
                    <Rate value={item.rating} disabled style={{ fontSize: 14, marginTop: 2 }} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {expandedReviewId === item.reviewId ? item.fullContent : item.content}
                    <Button
                      type="link"
                      size="small"
                      icon={<EllipsisOutlined />}
                      onClick={() => toggleContent(item.reviewId)}
                    >
                      {expandedReviewId === item.reviewId ? "접기" : "더보기"}
                    </Button>
                  </div>
                </div>
              </div>

              {item.imageUrls && (
                <Image.PreviewGroup>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {item.imageUrls.split(",").map((src, idx) => (
                      <Image
                        key={idx}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                        src={`http://localhost:8080${src}`}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}

              <div style={{ marginTop: 12 }}>
                <Button onClick={() => router.push(`/review/${item.reviewId}/edit`)}>
                  수정하기
                </Button>
                <div style={{ marginTop: 12 }}>
                  <Button block type="default">삭제하기</Button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <Button
                  block
                  type={likeStates[item.reviewId]?.liked ? "primary" : "default"}
                  onClick={() => toggleLike(item.reviewId)}
                >
                  👍 도움이 돼요 {likeStates[item.reviewId]?.count ?? 0}
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ReviewList;
