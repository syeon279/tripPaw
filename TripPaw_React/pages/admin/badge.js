// pages/admin/badge.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BadgeList from '@/components/badge/BadgeList';
import BadgeForm from '@/components/badge/BadgeForm';
import BadgeEditForm from '@/components/badge/BadgeEditForm';
import { Button } from 'antd';
import MypageLayout from '@/components/layout/MyPageLayout';

const AdminBadgePage = () => {
  const [badges, setBadges] = useState([]);
  const [editingBadge, setEditingBadge] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBadges = async () => {
    try {
      const res = await axios.get('/admin/badge');
      setBadges(res.data);
    } catch (err) {
      console.error('뱃지 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return (
    <MypageLayout>
      <div style={{ padding: 32 }}>
        <h2>뱃지 목록</h2>
        <Button type="primary" onClick={() => setShowForm(true)} style={{ marginBottom: 24 }}>
          뱃지 추가
        </Button>

        {showForm && (
          <BadgeForm
            onCancel={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchBadges();
            }}
          />
        )}

        {editingBadge && (
          <BadgeEditForm
            badgeData={editingBadge}
            onCancel={() => setEditingBadge(null)}
            onSuccess={() => {
              setEditingBadge(null);
              fetchBadges();
            }}
          />
        )}

        {!showForm && !editingBadge && (
          <BadgeList
            badges={badges}
            onEdit={(badge) => setEditingBadge(badge)}
            onDeleteSuccess={fetchBadges}
          />
        )}
      </div>
    </MypageLayout>
  );
};

export default AdminBadgePage;
