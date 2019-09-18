import { request } from '@/utils/request';

export async function recall(params) {
  return request('/api/box/recall-record/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function replace(params) {
  return request('/api/box/replace-record/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function scrap(params) {
  return request('/api/box/scrap-record/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
export async function scrapped(params) {
  return request('/api/box/scrap-box/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function installed(params) {
  return request('/api/box/installed-record/page', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
//恢复报废设备
export async function recover(params) {
  return request(`/api/box/resume-scrap-box/${params}`, {
    method: 'PUT',
  });
}
