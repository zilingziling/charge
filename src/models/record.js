import { recall, replace, scrap, installed, scrapped } from '@/services/record';

export default {
  namespace: 'record',

  state: {
    recall: {},
    replace: {},
    scrap: {},
    installed: {},
    scrapped: {},
  },

  effects: {
    *installed({ payload, callback }, { call, put }) {
      const response = yield call(installed, payload);
      callback(response);
      yield put({
        type: 'saveInstalled',
        payload: response.data ? response.data : {},
      });
    },

    *scrap({ payload, callback }, { call, put }) {
      const response = yield call(scrap, payload);
      callback(response);
      yield put({
        type: 'saveScrap',
        payload: response.data ? response.data : {},
      });
    },
    *scrapped({ payload, callback }, { call, put }) {
      const response = yield call(scrapped, payload);
      callback(response);
      yield put({
        type: 'saveScrapped',
        payload: response.data ? response.data : {},
      });
    },

    *recall({ payload, callback }, { call, put }) {
      const response = yield call(recall, payload);
      callback(response);
      yield put({
        type: 'saveRecall',
        payload: response.data ? response.data : {},
      });
    },

    *replace({ payload, callback }, { call, put }) {
      const response = yield call(replace, payload);
      callback(response);
      yield put({
        type: 'saveReplace',
        payload: response.data ? response.data : {},
      });
    },
  },
  reducers: {
    saveInstalled(state, action) {
      return {
        ...state,
        installed: action.payload,
      };
    },

    saveScrap(state, action) {
      return {
        ...state,
        scrap: action.payload,
      };
    },
    saveScrapped(state, action) {
      return {
        ...state,
        scrapped: action.payload,
      };
    },

    saveRecall(state, action) {
      return {
        ...state,
        recall: action.payload,
      };
    },

    saveReplace(state, action) {
      return {
        ...state,
        replace: action.payload,
      };
    },
  },
};
