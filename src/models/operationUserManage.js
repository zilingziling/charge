import { getUser, getRole, getDict, addUser, resetPwd } from '@/services/operationUserManage';

export default {
  namespace: 'operationUserManage',

  state: {
    user: {},
    role: {},
  },

  effects: {
    *resetPwd({ payload, callback }, { call, put }) {
      const response = yield call(resetPwd, payload);
      callback(response);
    },

    *addUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      callback(response);
    },

    *getDict({ payload, callback }, { call, put }) {
      const response = yield call(getDict, payload);
      callback(response);
    },

    *getUser({ payload, callback }, { call, put }) {
      const response = yield call(getUser, payload);
      callback(response);
      yield put({
        type: 'saveUser',
        payload: response.data ? response.data : {},
      });
    },

    *getRole({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      callback(response);
      yield put({
        type: 'saveRole',
        payload: response.data ? response.data : {},
      });
    },
  },

  reducers: {
    saveUser(state, action) {
      return {
        ...state,
        user: action.payload,
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
