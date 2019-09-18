import { request } from '@/utils/request';

export async function getEmpTree(p) {
  return request('/api/dept/select/org', {
    params: {
      ...p,
    },
  });
}
export async function getEmpList(p) {
  return request('/api/dept/select/orgStaff', {
    params: {
      ...p,
    },
  });
}
export async function getPosTree(p) {
  return request('/api/job/select/position', {
    params: {
      ...p,
    },
  });
}
export async function opeEmp(p) {
  return request('/api/staff/insert/staff', {
    method: 'POST',
    data: {
      ...p,
    },
  });
}
export async function getGender(p) {
  return request('/api/dict_type/dicts/map', {
    params: {
      ...p,
    },
  });
}
export async function delStaff(p) {
  return request(`/api/staff/delete/${p}`, {
    method: 'DELETE',
  });
}
export async function syncStaff(p) {
  return request(`/api/staff/synchronous/${p.id}`, {
    method: 'PUT',
    params: {
      isBd: p.isBd,
    },
  });
}
export async function addTree(p) {
  return request('/api/dept/insert/org', {
    method: 'POST',
    data: {
      ...p,
    },
  });
}
export async function delTree(p) {
  return request('/api/dept/delete/org', {
    method: 'GET',
    params: {
      ...p,
    },
  });
}
