import { getDicList, getDicType } from '@/services/systemManage/dictionary';

export default {
  namespace: 'dictionary',
  state: {
    dic: {
      dicList: [],
      total: '',
    },
    dicType: {
      dicTypeList: [],
      total: '',
    },
  },
  effects: {
    *getDicList({ payload, callback }, { call, put }) {
      const r = yield call(getDicList, payload);
      yield put({
        type: 'saveDic',
        payload: r.data,
      });
    },
    *getDicType({ payload, callback }, { call, put }) {
      const r = yield call(getDicType, payload);
      yield put({
        type: 'saveDicType',
        payload: r.data,
      });
    },
  },
  reducers: {
    saveDic(state, { payload }) {
      state.dic.dicList = payload.list;
      state.dic.total = payload.total;
      return state;
    },
    saveDicType(state, { payload }) {
      state.dicType.dicTypeList = payload.list;
      state.dicType.total = payload.total;
      return state;
    },
    clearDicList(state) {
      state.dic.dicList = [];
      state.dic.total = '';
      return state;
    },
  },
};
