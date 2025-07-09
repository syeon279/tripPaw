import React from 'react';

const SealTable = ({ seals, onEdit, onDelete }) => (
  <table>
    <thead>
      <tr>
        <th>이름</th>
        <th>카테고리</th>
        <th>이미지</th>
        <th>관리</th>
      </tr>
    </thead>
    <tbody>
      {seals.map(seal => (
        <tr key={seal.id}>
          <td>{seal.name}</td>
          <td>{seal.placeType.name}</td>
          <td><img src={`http://localhost:8080${seal.imageUrl}`} alt={seal.name} width="60" crossOrigin="anonymous" /></td>
          <td>
            <button onClick={() => onEdit(seal)}>수정</button>
            <button onClick={() => onDelete(seal.id)}>삭제</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SealTable;
