import React, { useEffect, useState } from 'react';
import { Rate, Checkbox, Input, Upload, Button, Row, Col, message } from 'antd';
import { UploadOutlined, QuestionOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';

const { TextArea } = Input;

const keywordOptions = [
  '트렌디해요', '청결 상태가 좋아요', '다시 방문하고 싶어요', '뷰가 멋있어요',
  '편안해요', '가격이 합리적이에요', '반려견 친화적', '서비스가 친절해요',
  '힐링돼요', '주차하기 편해요', '조용해요', '기대보다 아쉬웠어요'
];

const ReviewForm = () => {
  const router = useRouter();
  const { isReady, query } = router;

  const { tripPlanId, title, startDate, endDate } = query;
  const targetId = tripPlanId ? parseInt(tripPlanId) : null;

  const [rating, setRating] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [content, setContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState('');

  const reviewTypeId = 1;

  useEffect(() => {
    if (!isReady || !tripPlanId) return;

    axios.get('http://localhost:8080/review/weather', {
      params: {
        type: 'PLAN',
        targetId: Number(tripPlanId), // 꼭 숫자여야 해
      },
    })
      .then((res) => setWeather(res.data))
      .catch((err) => {
        console.error('날씨 정보 불러오기 실패:', err);
        setWeather('알 수 없음');
      });

  }, [isReady, tripPlanId]);

  useEffect(() => {
    console.log('[DEBUG] tripPlanId:', tripPlanId);
    console.log('[DEBUG] targetId:', targetId);
    console.log('[날씨 요청] type: PLAN, targetId:', tripPlanId, typeof tripPlanId);
  }, [tripPlanId]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleAIReview = async () => {
    if (keywords.length === 0) {
      message.warning("키워드를 하나 이상 선택해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/review/generate", {
        keywords,
      });

      const generated = res.data.content;
      setContent(generated);
      message.success("AI 리뷰가 생성되었습니다.");
    } catch (err) {
      message.error("AI 리뷰 생성 실패");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!targetId) {
      message.error('유효하지 않은 여행 ID입니다.');
      return;
    }

    const formData = new FormData();

    const reviewDto = {
      memberId: 1, // TODO: 로그인 유저로 교체 필요
      reviewTypeId,
      targetId,
      content,
      rating,
    };

    formData.append('review', JSON.stringify(reviewDto));
    fileList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    try {
      await axios.post('http://localhost:8080/review/write', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('리뷰가 성공적으로 저장되었습니다!');
    } catch (err) {
      console.error('리뷰 저장 실패', err);
      message.error('리뷰 저장 실패');
    }
  };

  const getWeatherImage = (condition) => {
    switch (condition) {
      case '흐림': return 'cloudy.png';
      case '맑음': return 'sun.png';
      case '구름많음': return 'mostly-cloudy.png';
      case '비': return 'rain.png';
      case '눈': return 'snow.png';
    }
  }

  if (!isReady) return <div>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {/* 상단 여행 정보 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</div>
          <div style={{ fontSize: 14, color: '#777' }}>
            일정 | {startDate} ~ {endDate}
          </div>
        </div>
        <div style={{ width: 60, textAlign: 'right' }}>
          {['맑음', '흐림', '비', '눈', '구름많음'].includes(weather) ? (
            <img
              src={`/image/weather/${getWeatherImage(weather)}`}
              alt={weather}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <QuestionOutlined style={{ fontSize: 24, color: '#ccc' }} />
          )}
        </div>
      </div>

      {/* 별점 */}
      <h4>이 장소에서의 경험은 어떠셨나요?</h4>
      <Rate value={rating} onChange={setRating} style={{ fontSize: 24 }} />

      {/* 키워드 */}
      <h4 style={{ marginTop: 30 }}>이 여행에 어울리는 키워드를 골라주세요.</h4>
      <Checkbox.Group value={keywords} onChange={setKeywords}>
        <Row gutter={[8, 8]} style={{ marginTop: 10 }}>
          {keywordOptions.map((keyword) => (
            <Col key={keyword}>
              <Checkbox value={keyword} style={{ fontSize: 14 }}>
                {keyword}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>

      {/* 텍스트 */}
      <TextArea
        rows={6}
        placeholder="리뷰를 작성해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ marginTop: 20 }}
      />

      {/* AI 버튼 */}
      <Button
        loading={loading}
        onClick={handleAIReview}
        block
        style={{ marginTop: 10, backgroundColor: '#000', color: '#fff' }}
      >
        AI 리뷰 작성
      </Button>

      {/* 업로드 */}
      <div style={{ marginTop: 24 }}>
        <Upload
          multiple
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
          listType="picture"
        >
          <Button icon={<UploadOutlined />}>사진 첨부하기</Button>
        </Upload>
      </div>

      {/* 하단 버튼 */}
      <Row justify="space-between" style={{ marginTop: 40 }}>
        <Col>
          <Button style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}>
            취소
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            style={{ backgroundColor: '#000', color: '#fff', border: 'none' }}
            size="large"
            onClick={handleSubmit}
          >
            다음으로 넘어가기
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewForm;
