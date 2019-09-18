import { request } from '@/utils/request';

export async function getTree(params) {
  return request('/api/menu/tree', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getMenu(params) {
  return request('/api/menu', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function postMenu(params) {
  return request('/api/menu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function putMenu(params) {
  return request(`/api/menu/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function deleteMenu(params) {
  return request(`/api/menu/${params.id}`, {
    method: 'DELETE',
  });
}
