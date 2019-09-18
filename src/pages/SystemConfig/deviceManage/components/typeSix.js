import React, { Component } from 'react';
import styles from './index.less';
import { Button, Radio, message } from 'antd';
import { bounceOut, restart } from '@/services/deviceManage';
class TypeSix extends Component {
  state = {
    clickOne: '',
    restartLoading: false,
    bounceLoading: false,
    slots: [],
    clickItem: '',
  };
  handleClickBox = (index, item) => {
    this.setState({
      clickOne: index,
      slots: [item],
      clickItem: item,
    });
  };
  // 重启
  enterRestartLoading = () => {
    const {
      data: { id },
    } = this.props;
    message.info('请求已发出');
    restart(id).then(res => {
      if (res.code === '000000') message.success('正在重启');
      else message.error(`${res.msg}`);
    });
    this.setState({ restartLoading: true });
    setTimeout(
      () =>
        this.setState({
          restartLoading: false,
        }),
      10000
    );
  };
  // 强弹
  enterBounceLoading = () => {
    const { slots } = this.state;
    const {
      data: { id },
    } = this.props;
    if (slots.length !== 1) message.error('请选择设备');
    else {
      message.info('请求已发出');
      bounceOut({ id, slots }).then(res => {
        if (res.code === '000000') {
          message.success('正在弹出');
          this.setState({
            clickOne: '',
          });
        } else message.error(`${res.msg}`);
      });
      this.setState({ bounceLoading: true });
      setTimeout(
        () =>
          this.setState({
            bounceLoading: false,
          }),
        10000
      );
    }
  };
  render() {
    const {
      data: { id, state },
    } = this.props;
    const { clickOne, clickItem } = this.state;
    return (
      <div className={styles.twelveWrapper}>
        <ul className={styles.deviceUl}>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <li
              onClick={e => this.handleClickBox(index, item)}
              style={{ background: clickOne === index ? '#1890FF' : '#fff' }}
              key={index}
            >
              {item}口
            </li>
          ))}
        </ul>
        <div className={styles.bottom}>
          <div className={styles.code12} />
          <ul className={styles.topOperateUl}>
            <li>设备编号：{id && id}</li>
            <li className={styles.secondLi12}>
              设备状态：
              <Radio defaultChecked>{state === 0 ? '离线' : state === 1 ? '在线' : ''}</Radio>
              <Button
                type="primary"
                loading={this.state.restartLoading}
                onClick={this.enterRestartLoading}
              >
                重启设备
              </Button>
            </li>
            <li>
              已选中 {clickItem} 口{' '}
              <Button
                type="primary"
                loading={this.state.bounceLoading}
                onClick={this.enterBounceLoading}
              >
                执行强弹操作
              </Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TypeSix;
