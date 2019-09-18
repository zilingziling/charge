import {
  agentRelations,
  configuredList,
  getDetails,
  getTotal,
  notConfiguredList,
} from '@/services/alreadyOut';

export default {
  namespace: 'alreadyOut',
  state: {
    configuredList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    notConfiguredList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
  },
  effects: {
    *getConfiguredList({ payload, callback }, { call, put }) {
      const res = yield call(configuredList, payload);
      if (res.data) {
        yield put({
          type: 'saveConfiguredList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *getTotal({ payload, callback }, { call, put }) {
      const res = yield call(getTotal);
      if (res.data) callback(res.data);
    },
    *getDetails({ payload, callback }, { call, put }) {
      const res = yield call(getDetails, payload);
      if (res.data) callback(res.data);
    },
    //   获取未分配设备列表
    *getNotConfiguredList({ payload, callback }, { call, put }) {
      const res = yield call(notConfiguredList, payload);
      if (res.data) {
        yield put({
          type: 'saveNotConfiguredList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    //  获取代理关系
    *getAgentRelations({ payload, callback }, { call, put }) {
      const res = yield call(agentRelations, payload);
      if (res.data) callback(res.data);
    },
  },
  reducers: {
    saveConfiguredList(state, { payload }) {
      state.configuredList = payload.data;
      return state;
    },
    saveNotConfiguredList(state, { payload }) {
      state.notConfiguredList = payload.data;
      return state;
    },
  },
};
