import {
  deleteBatchBaby,
  deleteNotOutBaby,
  editNotOutBaby,
  editOutBaby,
  getBatchBaby,
  getNotOutBaby,
  getOutBabyList,
  getOutBabyRecordList,
  operateBatchBaby,
  outBaby,
} from '@/services/chargeBabyS';

export default {
  namespace: 'chargeBaby',
  state: {
    batchBabyList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    notOutBabyList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    outBabyList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    outBabyRecordList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    exportId: '',
  },
  effects: {
    *getBatchBabyList({ payload, callback }, { call, put }) {
      const res = yield call(getBatchBaby, payload);
      if (res.data) {
        yield put({
          type: 'saveBatchBabyList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *operateBatchBaby({ payload, callback }, { call, put }) {
      const res = yield call(operateBatchBaby, payload);
      callback(res);
    },
    *deleteBatchBaby({ payload, callback }, { call, put }) {
      const res = yield call(deleteBatchBaby, payload);
      callback(res);
    },
    *deleteNotOutBaby({ payload, callback }, { call, put }) {
      const res = yield call(deleteNotOutBaby, payload);
      callback(res);
    },
    //  获取未出库设备列表
    *getNotOutBabyList({ payload, callback }, { call, put }) {
      const res = yield call(getNotOutBaby, payload);
      if (res.data) {
        yield put({
          type: 'saveNotOutBabyList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    //   编辑未出库设备
    *editNotOutBaby({ payload, callback }, { call, put }) {
      const res = yield call(editNotOutBaby, payload);
      callback(res);
    },
    // 出库设备
    *outBaby({ payload, callback }, { call, put }) {
      const res = yield call(outBaby, payload);
      callback(res);
    },
    // 获取出库列表
    *getOutBabyList({ payload, callback }, { call, put }) {
      const res = yield call(getOutBabyList, payload);
      if (res.data) {
        yield put({
          type: 'saveOutBabyList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    //  编辑出库
    *editOutBaby({ payload, callback }, { call, put }) {
      const res = yield call(editOutBaby, payload);
      callback(res);
    },
    //   获取出库记录列表
    *getOutBabyRecordList({ payload, callback }, { call, put }) {
      const res = yield call(getOutBabyRecordList, payload);
      if (res.data) {
        yield put({
          type: 'saveOutBabyRecordList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
  },
  reducers: {
    saveBatchBabyList(state, { payload }) {
      state.batchBabyList = payload.data;
      return state;
    },
    saveNotOutBabyList(state, { payload }) {
      state.notOutBabyList = payload.data;
      return state;
    },
    saveOutBabyList(state, { payload }) {
      state.outBabyList = payload.data;
      return state;
    },
    saveOutBabyRecordList(state, { payload }) {
      state.outBabyRecordList = payload.data;
      return state;
    },
    saveExportId(state, { payload }) {
      state.exportId = payload.exportId;
      return state;
    },
    clearExportId(state, { payload }) {
      state.exportId = null;
      return state;
    },
  },
};
