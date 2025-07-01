import React, { Component } from "react";
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';   // 공통css
import Head from 'next/head';
import wrapper from '../store/configureStore';
import { CookiesProvider } from "react-cookie";

const Ssdam = ({ Component }) => {
  //const { store, props } = wrapper.useWrappedStore(rest);
  //const { pageProps } = props;
  return (
    //<Provider store={store}>
    <CookiesProvider>
      <Head>
        <meta charSet="utf-8" />
        <title>TripPaw</title>
      </Head>
      <Component />
    </CookiesProvider>
    //</Provider>
  );
};
Ssdam.propTypes = {
  Component: PropTypes.elementType.isRequired,
  // pageProps : PropTypes.any.isRequired
}

export default wrapper.withRedux(Ssdam);