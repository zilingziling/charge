import { request } from '@/utils/request';
// 获取批次
export async function getBatchBaby(params) {
  return request('/api/terminal/batch/pageBatchs', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function operateBatchBaby(params) {
  return request('/api/terminal/batch/saveOrUpdate', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
//获取未出库小宝列表
export async function getNotOutBaby(params) {
  return request('/api/terminal/import/pageTerminal', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
//导入设备
export async function importChargeBaby(params) {
  return request('/api/terminal/import', {
    method: 'POST',
    requestType: 'form',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params,
  });
}
// 编辑未出库小宝
export async function editNotOutBaby(params) {
  return request('/api/terminal/import/edit', {
    method: 'PUT',
    data: { ...params },
  });
}
// 删除未出库小宝
export async function deleteNotOutBaby(params) {
  return request('/api/terminal/import/delete', {
    method: 'POST',
    data: params,
  });
}
// 删除小宝批次
export async function deleteBatchBaby(params) {
  return request('/api/terminal/batch/delete', {
    method: 'POST',
    data: params,
  });
}
//获取出库小宝列表
export async function getOutBabyList(params) {
  return request('/api/terminal/export/pageExports', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 获取已出库小宝列表

export async function getOutBabyRecordList(params) {
  return request('/api/terminal/pageExportTerminals', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 小宝出库
export async function outBaby(params) {
  return request('/api/terminal/export/addExport', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 小宝扫码
export async function scanBaby(params) {
  return request(`/api/terminal/isExists/${params}`, {
    method: 'GET',
  });
}
// 编辑小宝出库
export async function editOutBaby(params) {
  return request('/api/terminal/export/edit', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
