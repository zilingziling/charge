import { request } from '@/utils/request';
// 获取已部署设备列表
export async function configuredList(params) {
  return request('/api/box/installed', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
// 获取已部署列表统计数据
export async function getTotal() {
  return request('/api/box', {
    method: 'GET',
  });
}
// 已部署列表详情页
export async function getDetails(params) {
  return request(`/api/box/${params}`, {
    method: 'GET',
  });
}
// 获取未部署设备列表
export async function notConfiguredList(params) {
  return request('/api/box/waitAssign', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
// 获取代理关系
export async function agentRelations(params) {
  return request(`/api/box/relationship/${params}`, {
    method: 'GET',
  });
}
// 撤回设备
export async function recall(params) {
  return request(`/api/box/recall/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 替换设备
export async function replace(params) {
  return request('/api/box/change-box', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
//获取设备单价
export async function getPrice(params) {
  return request('/api/box/price/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
// 编辑已部署设备
export async function editConfigured(params) {
  return request('/api/box/editInstalled', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
