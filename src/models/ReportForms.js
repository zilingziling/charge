import { reward, order, orderDay, distribution } from '@/services/ReportForms';

export default {
  namespace: 'ReportForms',

  state: {
    reward: {},
    order: {},
    day: {},
    distribution: {},
  },

  effects: {
    *distribution({ payload, callback }, { call, put }) {
      const response = yield call(distribution, payload);
      callback(response);
      yield put({
        type: 'saveDistribution',
        payload: response.data ? response.data : {},
      });
    },

    *reward({ payload, callback }, { call, put }) {
      const response = yield call(reward, payload);
      callback(response);
      yield put({
        type: 'saveReward',
        payload: response.data ? response.data : {},
      });
    },

    *order({ payload, callback }, { call, put }) {
      const response = yield call(order, payload);
      callback(response);
      yield put({
        type: 'saveOrder',
        payload: response.data ? response.data : {},
      });
    },

    *orderDay({ payload, callback }, { call, put }) {
      const response = yield call(orderDay, payload);
      callback(response);
      yield put({
        type: 'saveDay',
        payload: response.data ? response.data : {},
      });
    },
  },
  reducers: {
    saveDistribution(state, action) {
      return {
        ...state,
        distribution: action.payload,
      };
    },

    saveReward(state, action) {
      return {
        ...state,
        reward: action.payload,
      };
    },

    saveOrder(state, action) {
      return {
        ...state,
        order: action.payload,
      };
    },

    saveDay(state, action) {
      return {
        ...state,
        day: action.payload,
      };
    },
  },
};
