import { apply, details, record, recordDetails, audit, putRecord } from '@/services/purchase';

export default {
  namespace: 'purchase',

  state: {
    apply: {},
    pass: {},
    fall: {},
    record: {},
  },

  effects: {
    *apply({ payload, callback }, { call, put }) {
      const response = yield call(apply, payload);
      callback(response);
      yield put({
        type: 'saveApply',
        payload: response.data ? response.data : {},
      });
    },

    *details({ payload, callback }, { call, put }) {
      const response = yield call(details, payload);
      callback(response);
    },

    *pass({ payload, callback }, { call, put }) {
      const response = yield call(apply, payload);
      callback(response);
      yield put({
        type: 'savePass',
        payload: response.data ? response.data : {},
      });
    },

    *fail({ payload, callback }, { call, put }) {
      const response = yield call(apply, payload);
      callback(response);
      yield put({
        type: 'saveFail',
        payload: response.data ? response.data : {},
      });
    },

    *record({ payload, callback }, { call, put }) {
      const response = yield call(record, payload);
      callback(response);
      yield put({
        type: 'saveRecord',
        payload: response.data ? response.data : {},
      });
    },

    *recordDetails({ payload, callback }, { call, put }) {
      const response = yield call(recordDetails, payload);
      callback(response);
    },

    *audit({ payload, callback }, { call, put }) {
      const response = yield call(audit, payload);
      callback(response);
    },

    *putRecord({ payload, callback }, { call, put }) {
      const response = yield call(putRecord, payload);
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

    saveRecord(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
  },
};
