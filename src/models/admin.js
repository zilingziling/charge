import { getAdmin, deleteAdmin, getRole, addAdmin, putAdmin } from '@/services/admin';

export default {
  namespace: 'admin',

  state: {
    admin: {},
    role: [],
  },

  effects: {
    *getAdmin({ payload, callback }, { call, put }) {
      const response = yield call(getAdmin, payload);
      callback(response);
      yield put({
        type: 'saveAdmin',
        payload: response.data ? response.data : {},
      });
    },

    *deleteAdmin({ payload, callback }, { call, put }) {
      const response = yield call(deleteAdmin, payload);
      callback(response);
    },

    *addAdmin({ payload, callback }, { call, put }) {
      const response = yield call(addAdmin, payload);
      callback(response);
    },

    *putAdmin({ payload, callback }, { call, put }) {
      const response = yield call(putAdmin, payload);
      callback(response);
    },

    *getRole({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      yield put({
        type: 'saveRole',
        payload: response.data ? response.data : [],
      });
    },
  },

  reducers: {
    saveAdmin(state, action) {
      return {
        ...state,
        admin: action.payload,
      };
    },

    saveRole(state, action) {
      return {
        ...state,
        role: action.payload,
      };
    },
  },
};
