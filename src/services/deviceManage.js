import { request } from '@/utils/request';
export async function bounceOut(params) {
  return request(`/api/box/${params.id}/eject-slots`, {
    method: 'PUT',
    data: {
      slots: params.slots,
    },
  });
}
export async function searchBox(params) {
  return request(`/api/box/${params}/manage`, {
    method: 'GET',
  });
}
// 重启设备
export async function restart(params) {
  return request(`/api/box/${params}/restart`, {
    method: 'PUT',
  });
}
