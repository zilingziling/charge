import { request } from '@/utils/request';

export async function getUser(params) {
  return request('/api/systemUser', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function addUser(params) {
  return request('/api/systemUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function resetPwd(params) {
  return request(`/api/systemUser/${params.userId}`, {
    method: 'PUT',
  });
}

export async function getRole(params) {
  return request('/api/newRole', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

///dict/{pid}/tree
export async function getDict(params) {
  return request(`/api/dict_type/dicts/map`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
