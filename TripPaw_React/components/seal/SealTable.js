import { Card, Col, Row } from 'antd';
import React from 'react';

const SealTable = ({ seals, onEdit, onDelete }) => (
  <>
  <div className="site-card-wrapper" style={{padding:'2em'}}>
    <Row gutter={36}>
      {seals.map(seal =>(
        <Col span={4}>
          <div>{seal.placeType.name}</div>
          <div style={{border:'1px solid red', height:'10em'}}><img src={`http://localhost:8080${seal.imageUrl}`} alt={seal.name} width="60" crossOrigin="anonymous" /></div>
          <Card title={seal.name} bordered={false}>
            <div>
              <button onClick={() => onEdit(seal)}>수정</button>
              <button onClick={() => onDelete(seal.id)}>삭제</button>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
  </>
);

export default SealTable;
