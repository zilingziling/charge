import { login, logout, password } from '@/services/login';

export default {
  namespace: 'Login',

  state: {
    login: {},
  },

  effects: {
    *password({ payload, callback }, { call, put }) {
      const response = yield call(password, payload);
      callback(response);
    },

    *login({ payload, callback }, { call, put }) {
      const response = yield call(login, payload);
      callback(response);
      yield put({
        type: 'saveLogin',
        payload: response.data ? response.data : {},
      });
    },

    *logout({ payload, callback }, { call, put }) {
      const response = yield call(logout, payload);
      callback(response);
    },
  },
  reducers: {
    //订单详情
    saveLogin(state, action) {
      return {
        ...state,
        login: action.payload,
      };
    },
  },
};
