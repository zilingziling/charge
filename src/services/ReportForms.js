import { request } from '@/utils/request';

export async function reward(params) {
  return request('/api/report/distribution-details/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function order(params) {
  return request('/api/report/dayBill', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function orderDay(params) {
  return request('/api/order/order-day/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function distribution(params) {
  return request('/api/report/platform-distribution-details/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
