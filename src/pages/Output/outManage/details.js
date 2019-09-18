import React, { Component } from 'react';
import { Card, Button } from 'antd';
import styles from './details.less';
import moment from 'moment';
class Details extends Component {
  handleReturn = () => {
    const { clickReturn } = this.props;
    clickReturn();
  };
  // 商户编号处理
  idSlice = (num, length) => {
    //这里用slice和substr均可
    return (Array(length).join('0') + num).slice(-length);
  };
  render() {
    const { info } = this.props;
    return (
      <div className={styles.wrapper}>
        <Card style={{ marginTop: '20px' }}>
          <ul className={styles.infoCard}>
            <li>
              <p>订单总收益（元）</p>
              <h1>
                {info.orderPriceSum || info.orderPriceSum === 0
                  ? (info.orderPriceSum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
            <li>
              <p>订单总量</p>
              <h1>{info.orderCountSum || info.orderCountSum === 0 ? info.orderCountSum : '无'}</h1>
            </li>
            <li>
              <p>昨日订单总额（元）</p>
              <h1>
                {info.yesterdayOrderPriceSum || info.yesterdayOrderPriceSum === 0
                  ? (info.yesterdayOrderPriceSum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
            <li>
              <p>昨日订单总量</p>
              <h1>
                {info.yesterdayOrderCount || info.yesterdayOrderCount === 0
                  ? info.yesterdayOrderCount
                  : '无'}
              </h1>
            </li>
          </ul>
        </Card>
        <Card style={{ marginTop: '20px' }}>
          <div className={styles.details}>
            <ul>
              <li>
                商户编号<span>{info.id ? '6100' + this.idSlice(info.id, 4) : '无'}</span>
              </li>
              <li>
                商户状态
                <span>{info.state === 0 ? '已关联' : info.state === 1 ? '未关联' : '无'}</span>
              </li>
              <li>
                联系人<span>{info.linkman ? info.linkman : '无'}</span>
              </li>
              <li>
                上级代理<span>{info.parentAgentName ? info.parentAgentName : '无'}</span>{' '}
              </li>
              <li>
                营业时间<span>{info.openTime ? info.openTime : '无'}</span>
              </li>
              <li>
                详细地址<span>{info.address ? info.address : '无'}</span>
              </li>
            </ul>
            <ul>
              <li>
                商户名称<span>{info.name ? info.name : '无'}</span>
              </li>
              <li>
                联系方式<span>{info.linktel ? info.linktel : '无'}</span>{' '}
              </li>
              <li>
                上级代理联系方式<span>{info.parentAgentPhone ? info.parentAgentPhone : '无'}</span>
              </li>
              <li>
                人均消费<span>{info.personCost ? info.personCost : '无'}</span>
              </li>
              <li>
                注册时间
                <span>
                  {info.createTime ? moment(info.createTime).format('YYYY/MM/DD HH:mm:ss') : '无'}
                </span>
              </li>
            </ul>
          </div>
        </Card>
        <Button type="primary" onClick={this.handleReturn}>
          返回
        </Button>
      </div>
    );
  }
}

export default Details;
