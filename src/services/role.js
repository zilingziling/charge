import { request } from '@/utils/request';
export async function getRoleList(params) {
  return request('/api/role/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
//编辑或新增

export async function roleOperate(params) {
  return request('/api/role', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
// 编辑时获取用户权限
export async function roleEdit(params) {
  return request(`/api/sysUser/roleResources/${params}`, {
    method: 'GET',
  });
}
//获取treeData
export async function getTreeData() {
  return request('/api/resource', {
    method: 'GET',
  });
}
