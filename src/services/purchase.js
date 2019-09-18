import { request } from '@/utils/request';

export async function apply(params) {
  return request('/api/procurement/apply/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function details(params) {
  return request(`/api/procurement/apply/${params.id}`, {
    method: 'GET',
  });
}

export async function record(params) {
  return request('/api/procurement/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function recordDetails(params) {
  return request(`/api/procurement/${params.id}`, {
    method: 'GET',
  });
}

export async function audit(params) {
  return request(`/api/procurement/apply/${params.id}/audit`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function putRecord(params) {
  return request(`/api/procurement/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
