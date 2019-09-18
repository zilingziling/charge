import { notification } from 'antd';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err);
      notification.error({
        message: `请求错误`,
      });
    },
  },
};

export function render(oldRender) {
  oldRender();
}
