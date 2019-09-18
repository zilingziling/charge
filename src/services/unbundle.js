import { request } from '@/utils/request';

export async function unbundle(params) {
  return request('/api/unBindSeller', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function details(params) {
  return request(`/api/unBindSeller/${params.id}`, {
    method: 'GET',
  });
}

export async function unBundlePut(params) {
  return request('/api/unBindSeller', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
