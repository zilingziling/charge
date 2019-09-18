import { waitHandle, order, device, user, agent, moneyEcharts } from '@/services/index';

export default {
  namespace: 'index',

  state: {
    waitHandle: {},
    order: {},
    device: {},
    user: {},
    agent: {},
    moneyEcharts: {},
  },

  effects: {
    //待办事项
    *waitHandle({ payload }, { call, put }) {
      const response = yield call(waitHandle, payload);
      yield put({
        type: 'saveWaitHandle',
        payload: response.data ? response.data : {},
      });
    },
    //订单统计
    *order({ payload }, { call, put }) {
      const response = yield call(order, payload);
      yield put({
        type: 'saveOrder',
        payload: response.data ? response.data : {},
      });
    },
    //设备统计
    *device({ payload }, { call, put }) {
      const response = yield call(device, payload);
      yield put({
        type: 'saveDevice',
        payload: response.data ? response.data : {},
      });
    },
    //用户统计
    *user({ payload }, { call, put }) {
      const response = yield call(user, payload);
      yield put({
        type: 'saveUser',
        payload: response.data ? response.data : {},
      });
    },
    //代理统计
    *agent({ payload }, { call, put }) {
      const response = yield call(agent, payload);
      yield put({
        type: 'saveAgent',
        payload: response.data ? response.data : {},
      });
    },
    //7日订单金额走势
    *moneyEcharts({ callback }, { call, put }) {
      const response = yield call(moneyEcharts);
      callback(response);
      yield put({
        type: 'saveMoneyEcharts',
        payload: response.data ? response.data : {},
      });
    },
  },

  reducers: {
    //待办事项
    saveWaitHandle(state, action) {
      return {
        ...state,
        waitHandle: action.payload,
      };
    },
    //订单统计
    saveOrder(state, action) {
      return {
        ...state,
        order: action.payload,
      };
    },
    //设备统计
    saveDevice(state, action) {
      return {
        ...state,
        device: action.payload,
      };
    },
    //用户统计
    saveUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    //代理统计
    saveAgent(state, action) {
      return {
        ...state,
        agent: action.payload,
      };
    },
    //7日订单金额走势
    saveMoneyEcharts(state, action) {
      return {
        ...state,
        moneyEcharts: action.payload,
      };
    },
  },
};
