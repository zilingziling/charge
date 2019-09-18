import { withdraw, audit } from '@/services/withdraw';

export default {
  namespace: 'withdraw',

  state: {
    toAudit: {},
    pass: {},
    fall: {},
  },

  effects: {
    *toAudit({ payload, callback }, { call, put }) {
      const response = yield call(withdraw, payload);
      callback(response);
      yield put({
        type: 'saveToAudit',
        payload: response.data ? response.data : {},
      });
    },

    *pass({ payload, callback }, { call, put }) {
      const response = yield call(withdraw, payload);
      callback(response);
      yield put({
        type: 'savePass',
        payload: response.data ? response.data : {},
      });
    },

    *fail({ payload, callback }, { call, put }) {
      const response = yield call(withdraw, payload);
      callback(response);
      yield put({
        type: 'saveFail',
        payload: response.data ? response.data : {},
      });
    },

    *audit({ payload, callback }, { call, put }) {
      const response = yield call(audit, payload);
      callback(response);
    },
  },

  reducers: {
    saveToAudit(state, action) {
      return {
        ...state,
        toAudit: action.payload,
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
