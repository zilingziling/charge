import { request } from '@/utils/request';

export async function getPalOrder(p) {
  return request("/api/plus/order",{
    params:{
      ...p
    }
  })
}
