import { request, requestNoHeader } from '@/utils/request';

export async function login(params) {
  return requestNoHeader('/api/sysUser/login', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function logout(params) {
  return request('/api/sysUser', {
    method: 'DELETE',
  });
}

export async function password(params) {
  return request('/api/sysUser/change-password', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
