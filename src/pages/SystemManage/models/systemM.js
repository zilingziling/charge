import { addRole, getloginLog, getOpeLog, getRoles } from '@/services/systemManage/systemManage';

export default {
  namespace: 'systemM',
  state: {
    role: {
      roleList: [],
      total: '',
      roleName: '',
    },
    loginLog: {
      loginList: [],
      total: '',
    },
    opeLog: {
      opeList: [],
      total: '',
    },
  },
  effects: {
    *getRoles({ payload, c }, { call, put }) {
      const res = yield call(getRoles, payload);
      yield put({
        type: 'saveRole',
        payload: res.data,
      });
    },
    *getLogin({ payload, c }, { call, put }) {
      const r = yield call(getloginLog, payload);
      yield put({
        type: 'saveLogin',
        payload: r.data,
      });
    },
    *getOpe({ payload, c }, { call, put }) {
      const r = yield call(getOpeLog, payload);
      yield put({
        type: 'saveOpe',
        payload: r.data,
      });
    },
  },
  reducers: {
    saveRole(state, { payload }) {
      state.role.roleList = payload.list;
      state.role.total = payload.total;
      return state;
    },
    saveLogin(state, { payload }) {
      state.loginLog.loginList = payload.list;
      state.loginLog.total = payload.total;
      return state;
    },
    saveOpe(state, { payload }) {
      state.opeLog.opeList = payload.list;
      state.opeLog.total = payload.total;
      return state;
    },
  },
};
