import { request } from '@/utils/request';

export async function freeze(params) {
  return request('/api/box/Return-money/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function returned(params) {
  return request(`/api/box/${params.id}/return-money`, {
    method: 'POST',
  });
}
