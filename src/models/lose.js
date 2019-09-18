import { lose, details, lostPut, retrievePut } from '@/services/lose';

export default {
  namespace: 'lose',

  state: {
    warning: {},
    lost: {},
  },

  effects: {
    *warning({ payload, callback }, { call, put }) {
      const response = yield call(lose, payload);
      callback(response);
      yield put({
        type: 'saveWarning',
        payload: response.data ? response.data : {},
      });
    },

    *lost({ payload, callback }, { call, put }) {
      const response = yield call(lose, payload);
      callback(response);
      yield put({
        type: 'saveLost',
        payload: response.data ? response.data : {},
      });
    },

    *details({ payload, callback }, { call, put }) {
      const response = yield call(details, payload);
      callback(response);
    },

    *lostPut({ payload, callback }, { call, put }) {
      const response = yield call(lostPut, payload);
      callback(response);
    },

    *retrievePut({ payload, callback }, { call, put }) {
      const response = yield call(retrievePut, payload);
      callback(response);
    },
  },
  reducers: {
    saveWarning(state, action) {
      return {
        ...state,
        warning: action.payload,
      };
    },

    saveLost(state, action) {
      return {
        ...state,
        lost: action.payload,
      };
    },
  },
};
