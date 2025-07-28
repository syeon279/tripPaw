import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

axios.defaults.baseURL = 'http://3.34.235.202:8080';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([

  ]);
}