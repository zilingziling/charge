import { request } from '@/utils/request';

export async function agentRelation(params) {
  return request('/api/manager/agent', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function agentDetails(params) {
  return request('/api/manager/getagentInfo', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function relation(params) {
  return request('/api/manager/getagentInfo/agentrelation', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function storeList(params) {
  return request('/api/manager/storelist/agent', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function employee(params) {
  return request('/api/manager/employee', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function employeeStore(params) {
  return request('/api/manager/employee/storelist', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function employeeBind(params) {
  return request('/api/manager/update/store', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function shopList(params) {
  return request('/api/manager/business', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function shopStoreList(params) {
  return request('/api/manager/business/storelist', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function storeManage(params) {
  return request('/api/manager/storelist', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}///manager/store/device

export async function storeDevice(params) {
  return request('/api/manager/store/device', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
