import React from 'react';
import { Menu, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentHeader from './ContentHeader';

const AppLayoutWrapper = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
`;

const ColWithOrder = styled(Col)`
  &.nav-col { order: 10; } /* 모바일에서 하단 */ 
  &.main-col { order: 1; }
  &.right-col { order: 2; }

  @media (min-width: 768px) {
    &.nav-col { order: 1; }
    &.main-col { order: 2; }
    &.right-col {  order: 3; }
  }
`;

const AppLayout = ({ children, group, members }) => {

  return (

    <>
      <AppLayoutWrapper>
        <ContentHeader />
        {children}
      </AppLayoutWrapper>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;