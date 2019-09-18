import { getAgent, getLog, getShop, getUser } from '@/services/userManage/userManage';

export default {
  namespace: 'userManage',
  state: {
    userList: {
      list: [],
      total: '',
    },
    userLog: {
      list: [],
      total: '',
    },
    agent: {
      list: [],
      total: '',
    },
    shop: {
      list: [],
      total: '',
    },
  },
  effects: {
    *getUser({ p, c }, { call, put }) {
      const res = yield call(getUser, p);
      if (res.code === '000000')
        yield put({
          type: 'saveU',
          p: res.data,
        });
    },
    *getLog({ p }, { call, put }) {
      const r = yield call(getLog, p);
      if (r.code === '000000')
        yield put({
          type: 'saveLog',
          p: r.data,
        });
    },
    *getAgent({ p }, { call, put }) {
      const r = yield call(getAgent, p);
      if (r.code === '000000')
        yield put({
          type: 'saveAgent',
          p: r.data,
        });
    },
    *getShop({ p }, { call, put }) {
      const r = yield call(getShop, p);
      if (r.code === '000000')
        yield put({
          type: 'saveShop',
          p: r.data,
        });
    },
  },
  reducers: {
    saveU(state, { p }) {
      state.userList.list = p.list;
      state.userList.total = p.total;
      return state;
    },
    saveLog(state, { p }) {
      state.userLog.list = p.list;
      state.userLog.total = p.total;
      return state;
    },
    saveAgent(state, { p }) {
      state.agent.list = p.list;
      state.agent.total = p.total;
      return state;
    },
    saveShop(state, { p }) {
      state.shop.list = p.list;
      state.shop.total = p.total;
      return state;
    },
  },
};
