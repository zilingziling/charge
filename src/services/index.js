import { request } from '@/utils/request';

//待办事项接口
export async function waitHandle(params) {
  return request('/api/index/waitHandle', {
    method: 'GET',
  });
}

//订单统计
export async function order(params) {
  return request('/api/index/order', {
    method: 'GET',
  });
}

//设备统计
export async function device(params) {
  return request('/api/index/device', {
    method: 'GET',
  });
}

//用户统计
export async function user(params) {
  return request('/api/index/user', {
    method: 'GET',
  });
}

//代理统计
export async function agent(params) {
  return request('/api/index/agent', {
    method: 'GET',
  });
}

//7日订单金额走势
export async function moneyEcharts(params) {
  return request('/api/index/moneyEcharts', {
    method: 'GET',
  });
}
