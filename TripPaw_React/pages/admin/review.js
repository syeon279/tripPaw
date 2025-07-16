import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Tabs,
  Card,
  Rate,
  Image,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Row,
  Col
} from 'antd';
import MypageLayout from '@/components/layout/MyPageLayout';

const { TabPane } = Tabs;

// 이미지 url 포맷 함수
const getValidImageUrl = (url) => {
  if (!url) return "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
  if (url.startsWith("ipfs://")) return url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
  if (url.includes("ipfs.io")) return url.replace("https://ipfs.io/ipfs/", "https://gateway.pinata.cloud/ipfs/");
  return url;
};

const ReviewCard = ({ review, onDelete, onOpenIssueModal }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/review/${review.reviewId}`);
      message.success('리뷰가 삭제되었습니다.');
      onDelete();
    } catch (err) {
      console.error(err);
      message.error('리뷰 삭제 실패');
    }
  };

  return (
    <Card
      title={review.memberNickname}
      style={{ marginBottom: 16 }}
      extra={
        <>
          <Button size="small" onClick={() => onOpenIssueModal(review.memberNickname)}>🎁 NFT 발급</Button>
          <Popconfirm
            title="정말 이 리뷰를 삭제하시겠습니까?"
            onConfirm={handleDelete}
            okText="예"
            cancelText="아니오"
          >
            <Button danger size="small" style={{ marginLeft: 8 }}>삭제</Button>
          </Popconfirm>
        </>
      }
    >
      <p>
        <strong>{review.planTitle ? '플랜명' : '장소명'}:</strong>{' '}
        {review.planTitle || review.placeName}
      </p>
      <p><strong>좋아요:</strong> {review.likeCount}</p>
      <p><strong>별점:</strong> <Rate disabled value={review.rating} /></p>
      <p><strong>날씨:</strong> {review.weatherCondition}</p>
      <p><strong>내용:</strong> {review.content}</p>
      
      {review.imageUrls &&
        review.imageUrls.split(',').map((url, idx) => (
          <Image
            key={idx}
            src={url}
            alt="review"
            width={100}
            style={{ marginRight: 8 }}
          />
        ))}
    </Card>
  );
};

const ReviewAdminPage = () => {
  const [planReviews, setPlanReviews] = useState([]);
  const [placeReviews, setPlaceReviews] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [issueModalVisible, setIssueModalVisible] = useState(false);
  const [selectedNickname, setSelectedNickname] = useState(null);
  const [selectedNftId, setSelectedNftId] = useState(null);
  const [issueForm] = Form.useForm();

  useEffect(() => {
    fetchPlanReviews();
    fetchPlaceReviews();
    fetchNfts();
  }, []);

  const fetchPlanReviews = async () => {
    try {
      const res = await axios.get('/review/admin/plan');
      setPlanReviews(res.data);
    } catch (err) {
      console.error('경로 리뷰 불러오기 실패', err);
    }
  };

  const fetchPlaceReviews = async () => {
    try {
      const res = await axios.get('/review/admin/place');
      setPlaceReviews(res.data);
    } catch (err) {
      console.error('장소 리뷰 불러오기 실패', err);
    }
  };

  const fetchNfts = async () => {
    try {
      const res = await axios.get('/api/nft/metadata');
      setNfts(res.data);
    } catch (err) {
      console.error('NFT 불러오기 실패', err);
      message.error('NFT 목록 로딩 실패');
    }
  };

  const onOpenIssueModal = (nickname) => {
    setSelectedNickname(nickname);
    setSelectedNftId(null);
    setIssueModalVisible(true);
    issueForm.resetFields();
  };

  const onIssueFinish = async (values) => {
    const { issuedReason } = values;
    if (!selectedNftId || !selectedNickname) {
      message.error("NFT 및 닉네임 선택 필수");
      return;
    }

    try {
      await axios.post(`/api/admin/nft/issue-to-member`, null, {
        params: {
          nftMetadataId: selectedNftId,
          issuedReason,
          nickname: selectedNickname,
        },
      });

    setNfts((prevNfts) =>
      prevNfts.map((nft) =>
        nft.id === selectedNftId ? { ...nft, issued: true } : nft
      )
    );

      message.success("NFT 발급 성공");
      setIssueModalVisible(false);
    } catch (err) {
      message.error("발급 실패: " + err.message);
    }
  };

  return (
    <MypageLayout>
      <div style={{ maxWidth: 1000, margin: '40px auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: 20 }}>
          관리자 리뷰 관리
        </h1>
        <Tabs defaultActiveKey="plan">
          <TabPane tab="경로 리뷰" key="plan">
            {planReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onDelete={fetchPlanReviews}
                onOpenIssueModal={onOpenIssueModal}
              />
            ))}
          </TabPane>
          <TabPane tab="장소 리뷰" key="place">
            {placeReviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onDelete={fetchPlaceReviews}
                onOpenIssueModal={onOpenIssueModal}
              />
            ))}
          </TabPane>
        </Tabs>

        {/* NFT 발급 모달 */}
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
              <Input.TextArea placeholder="예: 리뷰 감사 보상" />
            </Form.Item>

            <div style={{ marginTop: 16 }}>
              <h4>쿠폰 NFT 선택</h4>
              <Row gutter={[16, 16]}>
                {nfts.map((nft) => (
                  <Col span={8} key={nft.id}>
                    <Card
                      hoverable={!nft.issued}
                      onClick={() => {
                        if (!nft.issued) setSelectedNftId(nft.id);
                      }}
                      style={{
                        border: selectedNftId === nft.id ? "2px solid #1890ff" : "1px solid #ccc",
                        opacity: nft.issued ? 0.5 : 1,
                        position: "relative",
                      }}
                      cover={
                        <img
                          alt={nft.title}
                          src={getValidImageUrl(nft.imageUrl)}
                          style={{ height: 180, objectFit: "cover" }}
                        />
                      }
                    >
                      <Card.Meta
                        title={
                          <>
                            {nft.title}
                            {nft.issued && (
                              <span style={{
                                marginLeft: 8,
                                color: "red",
                                fontWeight: "bold",
                                fontSize: "0.9rem"
                              }}>
                                (발급 완료)
                              </span>
                            )}
                          </>
                        }
                        description={`포인트: ${nft.pointValue}`}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    </MypageLayout>
  );
};

export default ReviewAdminPage;
