import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

// 더미 reducer – 아무 동작 안 하지만 구조만 갖춤

const dummy = (state = {}, action) => {
  return state;
};

// (이전상태, 액션) => 다음상태
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        dummy,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;