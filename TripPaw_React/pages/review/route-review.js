import React, { useState, useEffect } from "react";
import { Tabs, List, Avatar, Rate, Tag, Button, Image, Spin } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import axios from "axios";

const { TabPane } = Tabs;

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/review/plan"); // 필요 시 http://localhost:8080 붙이기
      setReviews(response.data);
    } catch (err) {
      console.error("리뷰 불러오기 실패", err);
    }
    setLoading(false);
  };

  const toggleContent = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 24 }}>
      <h2 style={{ fontSize: "22px", fontWeight: 700 }}>여행 경로 리뷰</h2>

      <Tabs
        defaultActiveKey="latest"
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
              key={item.id}
              style={{ borderBottom: "1px solid #eee", paddingBottom: 24 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
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
                    <span style={{ fontWeight: 600 }}>{item.user}</span>
                    <Rate value={item.rating} disabled style={{ fontSize: 14, marginTop: 2 }} />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {expandedReviewId === item.id ? item.fullContent : item.content}
                    <Button
                      type="link"
                      size="small"
                      icon={<EllipsisOutlined />}
                      onClick={() => toggleContent(item.id)}
                    >
                      {expandedReviewId === item.id ? "접기" : "더보기"}
                    </Button>
                  </div>
                </div>
              </div>

              {item.images && item.images.length > 0 && (
                <Image.PreviewGroup>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {item.images.map((src, idx) => (
                      <Image
                        key={idx}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                        src={src}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              )}

              <div style={{ marginTop: 12 }}>
                <Button block type="default">
                  👍 도움이 돼요
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
