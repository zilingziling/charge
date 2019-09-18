import { getTree, deleteMenu, getMenu, postMenu, putMenu } from '@/services/position';

export default {
  namespace: 'position',

  state: {
    menu: {},
  },

  effects: {
    *deleteMenu({ payload, callback }, { call, put }) {
      const response = yield call(deleteMenu, payload);
      callback(response);
    },

    *postMenu({ payload, callback }, { call, put }) {
      const response = yield call(postMenu, payload);
      callback(response);
    },

    *putMenu({ payload, callback }, { call, put }) {
      const response = yield call(putMenu, payload);
      callback(response);
    },

    *getMenu({ payload, callback }, { call, put }) {
      const response = yield call(getMenu, payload);
      callback(response);
      yield put({
        type: 'saveMenu',
        payload: response.data ? response.data : {},
      });
    },

    *getTree({ payload, callback }, { call, put }) {
      const response = yield call(getTree, payload);
      callback(response);
    },
  },

  reducers: {
    saveMenu(state, action) {
      return {
        ...state,
        menu: action.payload,
      };
    },
  },
};
