// ✅ 1. components/checklist/ChecklistManagerLayout.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const ChecklistManagerLayout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ChecklistManagerLayout;