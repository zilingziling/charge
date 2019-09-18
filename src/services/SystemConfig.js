import { request } from '@/utils/request';

export async function logs(params) {
  return request('/api/logs/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getPrice(params) {
  return request('/api/box/price/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addPrice(params) {
  return request('/api/box/price', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deletePrice(params) {
  return request(`/api/box/price/${params.id}`, {
    method: 'DELETE',
  });
}

export async function getSys(params) {
  return request('/api/sys', {
    method: 'GET',
  });
}

export async function putSys(params) {
  return request('/api/sys', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
