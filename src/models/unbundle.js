import { unbundle, details, unBundlePut } from '@/services/unbundle';

export default {
  namespace: 'unBundle',

  state: {
    apply: {},
    pass: {},
    fall: {},
  },

  effects: {
    *audit({ payload, callback }, { call, put }) {
      const response = yield call(unBundlePut, payload);
      callback(response);
    },

    *applyFor({ payload, callback }, { call, put }) {
      const response = yield call(unbundle, payload);
      callback(response);
      yield put({
        type: 'saveApply',
        payload: response.data ? response.data : {},
      });
    },

    *pass({ payload, callback }, { call, put }) {
      const response = yield call(unbundle, payload);
      callback(response);
      yield put({
        type: 'savePass',
        payload: response.data ? response.data : {},
      });
    },

    *fail({ payload, callback }, { call, put }) {
      const response = yield call(unbundle, payload);
      callback(response);
      yield put({
        type: 'saveFail',
        payload: response.data ? response.data : {},
      });
    },

    *details({ payload, callback }, { call, put }) {
      const response = yield call(details, payload);
      callback(response);
    },
  },

  reducers: {
    saveApply(state, action) {
      return {
        ...state,
        apply: action.payload,
      };
    },

    savePass(state, action) {
      return {
        ...state,
        pass: action.payload,
      };
    },

    saveFail(state, action) {
      return {
        ...state,
        fall: action.payload,
      };
    },
  },
};
