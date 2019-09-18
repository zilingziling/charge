import { order } from '@/services/order';
import { orderDetails, overOrder, scrapOrder, orderScrap, scrapDetails } from '@/services/order';

export default {
  namespace: 'order',

  state: {
    underway: {},
    unpaid: {},
    prepaid: {},
    overtime: {},
    discard: {},
    detail: {},
    scrapDetails: {},
  },

  effects: {
    //废弃订单详情scrapDetails
    *scrapDetails({ payload, callback }, { call, put }) {
      const response = yield call(scrapDetails, payload);
      callback(response);
      yield put({
        type: 'saveScrapDetails',
        payload: response.data ? response.data : {},
      });
    },

    //废弃订单scrapOrder
    *scrapOrder({ payload, callback }, { call, put }) {
      const response = yield call(scrapOrder, payload);
      callback(response);
    },

    //强制结束
    *overOrder({ payload, callback }, { call, put }) {
      const response = yield call(overOrder, payload);
      callback(response);
    },

    //订单详情
    *orderDetails({ payload, callback }, { call, put }) {
      const response = yield call(orderDetails, payload);
      callback(response);
      yield put({
        type: 'saveDetail',
        payload: response.data ? response.data : {},
      });
    },
    //进行中
    *underway({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'saveUnderway',
        payload: response.data ? response.data : {},
      });
    },
    //废弃订单列表
    *orderScrap({ payload, callback }, { call, put }) {
      const response = yield call(orderScrap, payload);
      callback(response);
      yield put({
        type: 'saveOrderScrap',
        payload: response.data ? response.data : {},
      });
    },
    //未支付
    *unpaid({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'saveUnpaid',
        payload: response.data ? response.data : {},
      });
    },
    //已支付
    *prepaid({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'savePrepaid',
        payload: response.data ? response.data : {},
      });
    },
    //租借超时
    *overtime({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'saveOvertime',
        payload: response.data ? response.data : {},
      });
    },
    //订单废弃记录
    *discard({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'saveDiscard',
        payload: response.data ? response.data : {},
      });
    },
  },

  reducers: {
    //废弃订单详情saveScrapDetails
    saveScrapDetails(state, action) {
      return {
        ...state,
        scrapDetails: action.payload,
      };
    },
    //订单详情
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    //进行中
    saveUnderway(state, action) {
      return {
        ...state,
        underway: action.payload,
      };
    },
    //未支付
    saveUnpaid(state, action) {
      return {
        ...state,
        unpaid: action.payload,
      };
    },
    //已支付
    savePrepaid(state, action) {
      return {
        ...state,
        prepaid: action.payload,
      };
    },
    //租借超时
    saveOvertime(state, action) {
      return {
        ...state,
        overtime: action.payload,
      };
    },
    //订单废弃记录
    saveOrderScrap(state, action) {
      return {
        ...state,
        discard: action.payload,
      };
    },
  },
};
