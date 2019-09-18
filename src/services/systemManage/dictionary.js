import { request } from '@/utils/request';

export async function getDicList(p) {
  return request(`/api/dict`, {
    params: {
      ...p,
    },
  });
}
export async function getDicType(p) {
  return request('/api/dict_type', {
    params: {
      ...p,
    },
  });
}
export async function getSubTree(p) {
  return request(`/api/dict/tree`, {
    params: {
      ...p,
    },
  });
}
export async function addType(p) {
  return request('/api/dict_type', {
    method: 'POST',
    data: {
      ...p,
    },
  });
}
export async function editType(p) {
  return request(`/api/dict_type/${p.id}`, {
    method: 'PUT',
    data: {
      ...p,
    },
  });
}
export async function delType(p) {
  return request(`/api/dict_type/${p}`, {
    method: 'DELETE',
  });
}
export async function addDic(p) {
  return request('/api/dict', {
    method: 'POST',
    data: {
      ...p,
    },
  });
}
export async function editDic(p) {
  return request(`/api/dict/${p.dictId}`, {
    method: 'PUT',
    data: { ...p },
  });
}
export async function delDic(p) {
  return request(`/api/dict/${p}`, {
    method: 'DELETE',
  });
}
