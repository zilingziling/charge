import { getEmpList } from '@/services/systemManage/employee';

export default {
  namespace: 'employee',
  state: {
    emp: {
      empList: [],
      total: '',
    },
    depData: [],
    posData: [],
    key: null,
  },
  effects: {
    *getEmpList({ payload, callback }, { call, put }) {
      const r = yield call(getEmpList, payload);
      yield put({
        type: 'saveEmp',
        payload: r.data,
        key: payload.orgId,
      });
    },
  },
  reducers: {
    saveEmp(state, { payload, key }) {
      state.emp.empList = payload.list;
      state.emp.total = payload.total;
      state.key = key;
      return state;
    },
    savePosData(state, { payload }) {
      state.posData = payload.posData;
      return state;
    },
    saveDepData(state, { payload }) {
      state.depData = payload.depData;
      return state;
    },
  },
};
