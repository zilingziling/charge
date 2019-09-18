import { request } from '@/utils/request';

export async function userList(params) {
  return request('/api/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function forbidden(params) {
  return request(`/api/user/${params.userId}/${params.status}`, {
    method: 'PUT',
    data: {
      ...params,
      method: 'put',
    },
  });
}

export async function agent(params) {
  return request('/api/agent', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

//新增和修改代理商
export async function putAgent(params) {
  return request('/api/agent', {
    method: 'PUT',
    data: {
      ...params,
      method: 'put',
    },
  });
}
// 获取个人和企业代理详情
export async function getAgentDetail(params) {
  return request(`/api/agent/${params}`, {
    method: 'GET',
  });
}
// 个人代理和企业代理解除关联
export async function release(params) {
  return request(`/api/agent/${params}`, {
    method: 'DELETE',
  });
}
// 删除
export async function deleteAgent(params) {
  return request(`/api/agent/delete`, {
    method: 'POST',
    data: params,
  });
}
// 根据电话号码获取联系人
export async function getAgentByPhone(params) {
  return request(`/api/agent/getAgentByPhone/${params}`, {
    method: 'GET',
  });
}
// 关联确认
export async function confirmAssociate(params) {
  return request('/api/agent/relevance', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

// 获取商户列表
export async function getShopList(params) {
  return request('/api/seller/pageSeller', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
//商户关联
export async function confirmShopAssociate(params) {
  return request('/api/seller/relevance', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 新增或修改商户
export async function shopOperate(params) {
  return request('/api/seller', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
//商户解除关联
export async function shopRelease(params) {
  return request(`/api/seller/${params}`, {
    method: 'DELETE',
  });
}
// 删除商户
export async function deleteShop(params) {
  return request('/api/seller', {
    method: 'POST',
    data: params,
  });
}
// 获取银行卡列表
export async function getBankCardList(params) {
  return request('/api/credit/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
