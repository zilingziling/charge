import { request } from '@/utils/request';

export async function agentBaby(params) {
  return request('/api/terminal/pageAgentTerminals', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
