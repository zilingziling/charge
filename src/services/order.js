import { request } from '@/utils/request';

export async function order(params) {
  return request('/api/order', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function orderDetails(params) {
  console.log(params);
  return request(`/api/order/${params.id}`, {
    method: 'GET',
  });
}

//强制结束/order/over/{id}
export async function overOrder(params) {
  console.log(params);
  return request(`/api/order/over/${params.id}`, {
    method: 'PUT',
  });
}

//废弃订单/order/scrap/{id}
export async function scrapOrder(params) {
  console.log(params);
  return request(`/api/order/scrap/${params.id}`, {
    method: 'PUT',
  });
}

//废弃订单列表/order/order-scrap/page
export async function orderScrap(params) {
  return request('/api/order/order-scrap/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//废弃订单详情/order/scrap/{orderId}
export async function scrapDetails(params) {
  console.log(params);
  return request(`/api/order/scrap/${params.id}`, {
    method: 'GET',
  });
}
