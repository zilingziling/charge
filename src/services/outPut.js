import { request } from '@/utils/request';
// 批次管理
export async function getBatch(params) {
  return request('/api/storage/batch', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
//新增批次
export async function addBatch(params) {
  return request('/api/storage/batch', {
    method: 'PUT',
    data: {
      ...params,
      method: 'put',
    },
  });
}
// 删除批次
export async function deleteBatch(params) {
  return request('/api/storage/batch/delete', {
    method: 'POST',
    data: params,
  });
}
// 获取未出库设备列表
export async function getNotOut(params) {
  return request('/api/box/waitExport', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 编辑未出库设备
export async function editNotOut(params) {
  return request('/api/box/updateNotExportBox', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 报废设备
export async function scrapDevice(params) {
  return request('/api/box/scrapBox', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 出库设备
export async function outDevice(params) {
  return request('/api/export', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 获取出库列表
export async function getOutList(params) {
  return request('/api/export/pageExportList', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 出库查询领用人名字
export async function getOneAgent(params) {
  return request(`/api/agent/getOneAgentByPhone/${params}`, {
    method: 'GET',
  });
}
// 修改出库
export async function editOut(params) {
  return request('/api/export/update', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 获取出库记录列表
export async function outRecord(params) {
  return request('/api/export/export-record/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 扫码
export async function scanCode(params) {
  return request(`/api/box/isExists/${params}`, {
    method: 'GET',
  });
}
// 删除未出库设备
export async function deleteNotOut(params) {
  return request('/api/box/delete', {
    method: 'POST',
    data: params,
  });
}
//导入设备
export async function importDevice(params) {
  return request('/api/import', {
    method: 'POST',
    requestType: 'form',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params,
  });
}
