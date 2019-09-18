import { request } from '@/utils/request';

// 获取角色列表
export async function getRoles(p) {
  return request('/api/newRole', {
    params: {
      ...p,
    },
  });
}
export async function addRole(p) {
  return request('/api/newRole', {
    method: 'POST',
    data: {
      ...p,
    },
  });
}
export async function deleteRole(p) {
  return request(`/api/newRole/${p}`, {
    method: 'DELETE',
  });
}
export async function getMenu(p) {
  return request('/api/menu/tree', {
    params: {
      ...p,
    },
  });
}
export async function getSelectKey(p) {
  return request(`/api/newRole/${p}`);
}
export async function assign(p) {
  return request('/api/newRole', {
    method: 'PUT',
    data: {
      ...p,
    },
  });
}

export async function getloginLog(p) {
  return request('/api/logs/loginLogs', {
    params: {
      ...p,
    },
  });
}
export async function getOpeLog(p) {
  return request('/api/logs/operationLogs', {
    params: {
      ...p,
    },
  });
}
