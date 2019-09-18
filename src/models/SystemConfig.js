import { logs, getPrice, addPrice, deletePrice, getSys, putSys } from '@/services/SystemConfig';

export default {
  namespace: 'SystemConfig',

  state: {
    logs: {},
    price: {},
    sys: {},
  },

  effects: {
    *putSys({ payload, callback }, { call, put }) {
      const response = yield call(putSys, payload);
      callback(response);
    },

    *getSys({ payload, callback }, { call, put }) {
      const response = yield call(getSys, payload);
      callback(response);
      yield put({
        type: 'saveSys',
        payload: response.data ? response.data : {},
      });
    },

    *logs({ payload, callback }, { call, put }) {
      const response = yield call(logs, payload);
      callback(response);
      yield put({
        type: 'saveLogs',
        payload: response.data ? response.data : {},
      });
    },

    *getPrice({ payload, callback }, { call, put }) {
      const response = yield call(getPrice, payload);
      callback(response);
      yield put({
        type: 'savePrice',
        payload: response.data ? response.data : {},
      });
    },

    *addPrice({ payload, callback }, { call, put }) {
      const response = yield call(addPrice, payload);
      callback(response);
    },

    *deletePrice({ payload, callback }, { call, put }) {
      const response = yield call(deletePrice, payload);
      callback(response);
    },
  },

  reducers: {
    saveSys(state, action) {
      return {
        ...state,
        sys: action.payload,
      };
    },

    saveLogs(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },

    savePrice(state, action) {
      return {
        ...state,
        price: action.payload,
      };
    },
  },
};
