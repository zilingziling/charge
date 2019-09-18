import { request } from '@/utils/request';

export async function withdraw(params) {
  return request('/api/withdraw/pageWithdraw', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function audit(params) {
  return request('/api/withdraw', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
