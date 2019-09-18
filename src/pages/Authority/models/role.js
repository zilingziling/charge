import { getRoleList, roleOperate } from '@/services/role';
import { shopOperate } from '@/services/userManage';

export default {
  namespace: 'role',
  state: {
    roleList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
  },
  effects: {
    *getRoleList({ payload, callback }, { call, put }) {
      const res = yield call(getRoleList, payload);
      if (res.data) {
        yield put({
          type: 'saveRoleList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *roleOperate({ payload, callback }, { call, put }) {
      const res = yield call(roleOperate, payload);
      if (res) callback(res);
    },
  },
  reducers: {
    saveRoleList(state, { payload }) {
      state.roleList = payload.data;
      return state;
    },
  },
};
