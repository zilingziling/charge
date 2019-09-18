import {
  addBatch,
  deleteBatch,
  deleteNotOut,
  deleteNotout,
  editNotOut,
  editOut,
  getBatch,
  getNotOut,
  getOutList,
  outDevice,
  outRecord,
  scrapDevice,
} from '@/services/outPut';

export default {
  namespace: 'outPut',
  state: {
    batchList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    notOutList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    outList: {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      resultNumber: '',
      total: '',
      totalPages: '',
    },
    outRecordList: {
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
    *getBatchList({ payload, callback }, { call, put }) {
      const res = yield call(getBatch, payload);
      if (res.data) {
        yield put({
          type: 'saveBatchList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    *add({ payload, callback }, { call, put }) {
      const res = yield call(addBatch, payload);
      callback(res);
    },
    *delete({ payload, callback }, { call, put }) {
      const res = yield call(deleteBatch, payload);
      callback(res);
    },
    *deleteNotOut({ payload, callback }, { call, put }) {
      const res = yield call(deleteNotOut, payload);
      callback(res);
    },
    //  获取未出库设备列表
    *getNotOutList({ payload, callback }, { call, put }) {
      const res = yield call(getNotOut, payload);
      if (res.data) {
        yield put({
          type: 'saveNotOutList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    //   编辑未出库设备
    *editNotOut({ payload, callback }, { call, put }) {
      const res = yield call(editNotOut, payload);
      callback(res);
    },
    //   报废设备
    *scrapDevice({ payload, callback }, { call, put }) {
      const res = yield call(scrapDevice, payload);
      callback(res);
    },
    // 出库设备
    *out({ payload, callback }, { call, put }) {
      const res = yield call(outDevice, payload);
      callback(res);
    },
    // 获取出库列表
    *getOutList({ payload, callback }, { call, put }) {
      const res = yield call(getOutList, payload);
      if (res.data) {
        yield put({
          type: 'saveOutList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
    //  编辑出库
    *editOut({ payload, callback }, { call, put }) {
      const res = yield call(editOut, payload);
      callback(res);
    },
    //   获取出库记录列表
    *getOutRecord({ payload, callback }, { call, put }) {
      const res = yield call(outRecord, payload);
      if (res.data) {
        yield put({
          type: 'saveOutRecordList',
          payload: res,
        });
        if (callback) callback(res.data);
      }
    },
  },
  reducers: {
    saveBatchList(state, { payload }) {
      state.batchList = payload.data;
      return state;
    },
    saveNotOutList(state, { payload }) {
      state.notOutList = payload.data;
      return state;
    },
    saveOutList(state, { payload }) {
      state.outList = payload.data;
      return state;
    },
    saveOutRecordList(state, { payload }) {
      state.outRecordList = payload.data;
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
