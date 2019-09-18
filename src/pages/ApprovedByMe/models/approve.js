import { getReplenish } from '@/services/applyByMe';

export default {
  namespace: 'approve',
  state: {
    replenish: {
      list: [],
      total: '',
    },
  },
  effects: {
    *getReplenish({ p }, { call, put }) {
      const r = yield call(getReplenish, p);
      if (r.code === '000000')
        yield put({
          type: 'saveReplenish',
          p: r.data,
        });
    },
  },
  reducers: {
    saveReplenish(state, { p }) {
      state.replenish.list = p.list;
      state.replenish.total = p.total;
      return state;
    },
  },
};
