import { freeze, returned } from '@/services/freeze';

export default {
  namespace: 'freeze',

  state: {
    applyFor: {},
    pass: {},
  },

  effects: {
    *applyFor({ payload, callback }, { call, put }) {
      const response = yield call(freeze, payload);
      callback(response);
      yield put({
        type: 'saveApplyFor',
        payload: response.data ? response.data : {},
      });
    },

    *pass({ payload, callback }, { call, put }) {
      const response = yield call(freeze, payload);
      callback(response);
      yield put({
        type: 'savePass',
        payload: response.data ? response.data : {},
      });
    },

    *returned({ payload, callback }, { call, put }) {
      const response = yield call(returned, payload);
      callback(response);
    },
  },

  reducers: {
    saveApplyFor(state, action) {
      return {
        ...state,
        applyFor: action.payload,
      };
    },
    savePass(state, action) {
      return {
        ...state,
        pass: action.payload,
      };
    },
  },
};
