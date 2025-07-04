import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentHeader from '../ContentHeader';

const LayoutWrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
`;

const InnerContainer = styled.div`
  margin-top: 80px; /* Header 높이 고려 */
  padding: 20px;
`;

const MyPageLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <ContentHeader theme="dark" />
      <InnerContainer>
        {children}
      </InnerContainer>
    </LayoutWrapper>
  );
};

MyPageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyPageLayout;
