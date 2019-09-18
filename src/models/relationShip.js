import {
  agentRelation,
  agentDetails,
  relation,
  storeList,
  employee,
  employeeStore,
  employeeBind,
  shopList,
  shopStoreList,
  storeManage,
  storeDevice,
} from '@/services/relationShip';

export default {
  namespace: 'relationShip',

  state: {
    agentRelation: {},
    store: {},
    employee: {},
    employeeStore: {},
    shopList: {},
    shopStoreList: {},
    storeManage: {},
    device: {},
  },

  effects: {
    * agentRelation({ payload, callback }, { call, put }) {
      const response = yield call(agentRelation, payload);
      callback(response);
      yield put({
        type: 'saveAgentRelation',
        payload: response.data ? response.data : {},
      });
    },

    * agentDetails({ payload, callback }, { call, put }) {
      const response = yield call(agentDetails, payload);
      callback(response);
    },

    * relation({ payload, callback }, { call, put }) {
      const response = yield call(relation, payload);
      callback(response);
    },

    * storeList({ payload, callback }, { call, put }) {
      const response = yield call(storeList, payload);
      callback(response);
      yield put({
        type: 'saveStore',
        payload: response.data ? response.data : {},
      });
    },

    * employee({ payload, callback }, { call, put }) {
      const response = yield call(employee, payload);
      callback(response);
      yield put({
        type: 'saveEmployee',
        payload: response.data ? response.data : {},
      });
    },

    * employeeStore({ payload, callback }, { call, put }) {
      const response = yield call(employeeStore, payload);
      callback(response);
      yield put({
        type: 'saveEmployeeStore',
        payload: response.data ? response.data : {},
      });
    },

    * employeeBind({ payload, callback }, { call, put }) {
      const response = yield call(employeeBind, payload);
      callback(response);
    },

    * shopList({ payload, callback }, { call, put }) {
      const response = yield call(shopList, payload);
      callback(response);
      yield put({
        type: 'saveShopList',
        payload: response.data ? response.data : {},
      });
    },

    * shopStoreList({ payload, callback }, { call, put }) {
      const response = yield call(shopStoreList, payload);
      callback(response);
      yield put({
        type: 'saveShopStoreList',
        payload: response.data ? response.data : {},
      });
    },

    * storeManage({ payload, callback }, { call, put }) {
      const response = yield call(storeManage, payload);
      callback(response);
      yield put({
        type: 'saveStoreManage',
        payload: response.data ? response.data : {},
      });
    },

    * storeDevice({ payload, callback }, { call, put }) {
      const response = yield call(storeDevice, payload);
      callback(response);
      yield put({
        type: 'saveDevice',
        payload: response.data ? response.data : {},
      });
    },


  },

  reducers: {
    saveAgentRelation(state, action) {
      return {
        ...state,
        agentRelation: action.payload,
      };
    },

    saveStore(state, action) {
      return {
        ...state,
        store: action.payload,
      };
    },

    saveEmployee(state, action) {
      return {
        ...state,
        employee: action.payload,
      };
    },

    saveEmployeeStore(state, action) {
      return {
        ...state,
        employeeStore: action.payload,
      };
    },

    saveShopList(state, action) {
      return {
        ...state,
        shopList: action.payload,
      };
    },

    saveShopStoreList(state, action) {
      return {
        ...state,
        shopStoreList: action.payload,
      };
    },

    saveStoreManage(state, action) {
      return {
        ...state,
        storeManage: action.payload,
      };
    },

    saveDevice(state, action) {
      return {
        ...state,
        device: action.payload,
      };
    },


  },

};
