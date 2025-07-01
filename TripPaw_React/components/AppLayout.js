import React from 'react';
import { Menu, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContentHeader from './ContentHeader';

const AppLayoutWrapper = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
`;

const AppLayout = ({ children, }) => {

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