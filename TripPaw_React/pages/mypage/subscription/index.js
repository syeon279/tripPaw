import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Spin, Popconfirm, message } from 'antd';
import axios from 'axios';
import MypageLayout from '@/components/layout/MyPageLayout';

const Container = styled.div`
  max-width: 700px;
  margin: 100px auto;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
`;

const SubscriptionManagePage = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [memberId, setMemberId] = useState(null);

    // 로그인 사용자 확인
    const fetchLoginUser = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/auth/check', {
                withCredentials: true,
            });
            setMemberId(res.data.id);
            return res.data.id;
        } catch (err) {
            message.error('로그인 정보 확인 실패');
            return null;
        }
    };

    // 구독 정보 불러오기
    const fetchSubscription = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/subscription/latest/${id}`);
            setSubscription(res.data);
        } catch (err) {
            console.error('구독 정보 조회 실패:', err);
            message.error('구독 정보를 불러오지 못했습니다.');
        }
        setLoading(false);
    };

    // 구독 취소
    const handleCancel = async () => {
        try {
            await axios.put(`http://localhost:8080/subscription/cancel/${memberId}`);
            message.success('구독을 취소했습니다.');
            fetchSubscription(memberId);
        } catch (err) {
            console.error('구독 취소 실패:', err);
            message.error('구독 취소에 실패했습니다.');
        }
    };

    useEffect(() => {
        const init = async () => {
            const id = await fetchLoginUser();
            if (id) fetchSubscription(id);
        };
        init();
    }, []);

    return (
        <MypageLayout>
            <Container>
                <Title>구독 관리</Title>
                {loading ? (
                    <Spin tip="불러오는 중..." />
                ) : subscription ? (
                    <Card>
                        <p><strong>대상:</strong> {subscription.targetName || '구독 대상 없음'}</p>
                        <p><strong>구독 시작일:</strong> {new Date(subscription.createdAt).toLocaleDateString()}</p>
                        <p><strong>상태:</strong> {subscription.active ? '구독 중' : '취소됨'}</p>

                        {subscription.active && (
                            <Popconfirm
                                title="정말 구독을 취소하시겠습니까?"
                                onConfirm={handleCancel}
                                okText="예"
                                cancelText="아니오"
                            >
                                <Button danger>구독 취소</Button>
                            </Popconfirm>
                        )}
                    </Card>
                ) : (
                    <p>구독 정보가 없습니다.</p>
                )}
            </Container>
        </MypageLayout>
    );
};

export default SubscriptionManagePage;
