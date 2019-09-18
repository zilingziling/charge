import { agentBaby } from '@/services/baby';

export default {
  namespace: 'baby',

  state: {
    agentBaby: {},
  },

  effects: {
    *getAgentBaby({ payload, callback }, { call, put }) {
      const response = yield call(agentBaby, payload);
      callback(response);
      yield put({
        type: 'saveAgentBaby',
        payload: response.data ? response.data : {},
      });
    },
  },

  reducers: {
    saveAgentBaby(state, action) {
      return {
        ...state,
        agentBaby: action.payload,
      };
    },
  },
};
