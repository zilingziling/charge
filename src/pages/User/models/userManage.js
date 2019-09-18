import {
  agent,
  confirmAssociate,
  confirmShopAssociate,
  deleteAgent,
  deleteShop,
  forbidden,
  getAgentByPhone,
  getAgentDetail,
  getBankCardList,
  getShopList,
  putAgent,
  release,
  shopOperate,
  shopRelease,
  userList,
} from '@/services/userManage';

export default {
  namespace: 'userManage',
  state: {
    userList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    personalAgent: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    companyAgent: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    shopList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    bankCardList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
  },

  effects: {
    *getUserList({ payload, callback }, { call, put }) {
      const res = yield call(userList, payload);
      if (res.data) {
        yield put({
          type: 'saveUserList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *getBankCardList({ payload, callback }, { call, put }) {
      const res = yield call(getBankCardList, payload);
      if (res.data) {
        yield put({
          type: 'saveBankCardList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *forbidden({ payload, callback }, { call, put }) {
      const res = yield call(forbidden, payload);
      if (res) callback(res);
    },
    *personalAgent({ payload, callback }, { call, put }) {
      const res = yield call(agent, payload);
      if (res.data) {
        yield put({
          type: 'savePersonalAgent',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *companyAgent({ payload, callback }, { call, put }) {
      const res = yield call(agent, payload);
      if (res.data) {
        yield put({
          type: 'saveCompanyAgent',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *addPersonalAgent({ payload, callback }, { call, put }) {
      const res = yield call(putAgent, payload);
      if (res) callback(res);
    },
    *getAgentDetail({ payload, callback }, { call, put }) {
      const res = yield call(getAgentDetail, payload);
      if (res) callback(res.data);
    },
    // 解除关联
    *release({ payload, callback }, { call, put }) {
      const res = yield call(release, payload);
      if (res) callback(res);
    },
    //  批量删除
    *deleteAgent({ payload, callback }, { call, put }) {
      const res = yield call(deleteAgent, payload);
      if (res) callback(res);
    },
    //   根据电话号码获取代理
    *getAgentByPhone({ payload, operation }, { call, put }) {
      const res = yield call(getAgentByPhone, payload);
      if (res) operation(res);
    },
    //  确认关联
    *confirmAssociate({ payload, callback }, { call, put }) {
      const res = yield call(confirmAssociate, payload);
      if (res) callback(res);
    },
    *confirmShopAssociate({ payload, callback }, { call, put }) {
      const res = yield call(confirmShopAssociate, payload);
      if (res) callback(res);
    },
    //  获取商户列表
    *getShopList({ payload, callback }, { call, put }) {
      const res = yield call(getShopList, payload);
      if (res.data) {
        yield put({
          type: 'saveShopList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *shopOperate({ payload, callback }, { call, put }) {
      const res = yield call(shopOperate, payload);
      if (res) callback(res);
    },
    // 解除商户关联
    *shopRelease({ payload, callback }, { call, put }) {
      const res = yield call(shopRelease, payload);
      if (res) callback(res);
    },
    //  批量删除商户
    *deleteShop({ payload, callback }, { call, put }) {
      const res = yield call(deleteShop, payload);
      if (res) callback(res);
    },
  },
  reducers: {
    saveUserList(state, { payload }) {
      state.userList = payload.data;
      return state;
    },
    savePersonalAgent(state, { payload }) {
      state.personalAgent = payload.data;
      return state;
    },
    saveCompanyAgent(state, { payload }) {
      state.companyAgent = payload.data;
      return state;
    },
    saveShopList(state, { payload }) {
      state.shopList = payload.data;
      return state;
    },
    saveBankCardList(state, { payload }) {
      state.bankCardList = payload.data;
      return state;
    },
  },
};
