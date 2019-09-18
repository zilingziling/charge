import { getPalOrder } from '@/services/chargePal';

export default {
  namespace: 'chargePal',
  state: {
    pal: {
      list: [],
      total: '',
    },
  },
  effects: {
    *getPalOrder({ p, c }, { call, put }) {
      const r = yield call(getPalOrder,p);
      if (r.code === '000000')
        yield put({
          type: 'savePal',
          p: r.data,
        });
    },
  },
  reducers: {
    savePal(state, { p }) {
      state.pal.list = p.list;
      state.pal.total = p.total;
      return state;
    },
  },
};
