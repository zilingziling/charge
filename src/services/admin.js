import { request } from '@/utils/request';

export async function getAdmin(params) {
  return request('/api/sysUser/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteAdmin(params) {
  return request(`/api/sysUser/${params.id}/forbidden`, {
    method: 'PUT',
  });
}

export async function getRole(params) {
  return request('/api/role', {
    method: 'GET',
  });
}

export async function addAdmin(params) {
  return request('/api/sysUser', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

//
export async function putAdmin(params) {
  return request(`/api/sysUser/${params.id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
