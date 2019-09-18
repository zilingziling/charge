import { request } from '@/utils/request';

export async function lose(params) {
  return request('/api/box/warning/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function details(params) {
  return request(`/api/box/${params.id}`, {
    method: 'GET',
  });
}

export async function lostPut(params) {
  return request(`/api/box/lost/${params.id}`, {
    method: 'PUT',
  });
}

export async function retrievePut(params) {
  return request(`/api/box/retrieve/${params.id}`, {
    method: 'PUT',
  });
}
