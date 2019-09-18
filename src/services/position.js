import { request } from '@/utils/request';

export async function getTree(params) {
  return request('/api/job/select/position', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function getMenu(params) {
  return request('/api/job/postion', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function postMenu(params) {
  return request('/api/job/insert/position', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function putMenu(params) {
  return request(`/api/job/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function deleteMenu(params) {
  return request(`/api/job/${params.id}`, {
    method: 'DELETE',
  });
}
