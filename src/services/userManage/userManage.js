import { request } from '@/utils/request';

export async function getUser(p) {
 return  request('/api/client/user',{
      params:{
        ...p
      }
  })
}
export async function userDetail(p) {
  return request("/api/client/user/details",{
    params: {
      ...p
    }
  })
}
export async function getLog(p) {
  return request("/api/client/user/actionlog",{
    params:{...p}
  })
}
export async function getAgent(p) {
  return request("/api/client/user/agentlist",{
    params:{...p}
  })
}
export async function addAgent(p) {
  return request("/api/client/user/agentInsertOrUpdate",{
    method:"PUT",
    data:{
      ...p
    }
  })
}
export async function getShop(p) {
  return request("/api/client/user/businesslist",{
    params:{
      ...p
    }
  })
}
export async function shopD(p) {
  return request("/api/client/user/business/details",{
    params:{
      ...p
    }
  })
}
export async function addShop(p) {
  return request("/api/client/user/insertBusiness",{
    method: "PUT",
    data:{
      ...p
    }
  })
}
