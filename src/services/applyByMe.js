import { request } from '@/utils/request';

export async function getReplenish(p) {
  return request("/api/storageReplenish",{
    params:{...p}
  })
}
export async function addReplenish(p) {
  return request("/api/storageReplenish",{
    method:"POST",
    data:{
      ...p
    }
  })
}
// 补货审核
export async function audit(p) {
  return request("/api/audit/storage",{
    method: "POST",
    data:{
      ...p
    }
  })
}
export async function getReason(p) {
  return request(`/api/audit/storage/${p.sceneId}/${p.type}`)
}
export async function scanDel(p) {
  return request("/api/storageReplenish/sendDevices",{
    method:"POST",
    data:{...p}
  })
}


