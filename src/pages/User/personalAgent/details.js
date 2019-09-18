import React, { Component } from 'react';
import { Card, Button } from 'antd';
import styles from './details.less';
import moment from 'moment';
class Details extends Component {
  handleReturn = () => {
    const { clickReturn } = this.props;
    clickReturn();
  };
  render() {
    const { info } = this.props;

    return (
      <div className={styles.wrapper}>
        <Card style={{ marginTop: '20px' }}>
          <ul className={styles.infoCard}>
            <li>
              <p>直属下级代理总数</p>
              <h1>{info.childCount || info.childCount === 0 ? info.childCount : '无'}</h1>
            </li>
            <li>
              <p>直属商户总数</p>
              <h1>
                {info.directSellerCount || info.directSellerCount === 0
                  ? info.directSellerCount
                  : '无'}
              </h1>
            </li>
            <li>
              <p>待分配设备</p>
              <h1>
                {info.waitAssignBoxCount || info.waitAssignBoxCount === 0
                  ? info.waitAssignBoxCount
                  : '无'}
              </h1>
            </li>
            <li>
              <p>已分配设备</p>
              <h1>
                {info.assignedBoxCount || info.assignedBoxCount === 0
                  ? info.assignedBoxCount
                  : '无'}
              </h1>
            </li>
            <li>
              <p>设备分配率</p>
              <h1>
                {info.assignBoxPercent || info.assignBoxPercent === 0
                  ? info.assignBoxPercent
                  : '无'}
              </h1>
            </li>
            <li>
              <p>订单总量</p>
              <h1>{info.orderCount || info.orderCount === 0 ? info.orderCount : '无'}</h1>
            </li>
            <li>
              <p>订单总收益</p>
              <h1>
                {info.orderRewardSum || info.orderRewardSum === 0
                  ? (info.orderRewardSum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
          </ul>
        </Card>
        <Card style={{ marginTop: '20px' }}>
          <div className={styles.details}>
            {info.userType === 1 ? (
              <ul>
                <li>
                  企业名称<span>{info.companyName ? info.companyName : '无'}</span>
                </li>
              </ul>
            ) : null}
            <ul>
              <li>
                代理编号<span>{info.id ? info.id : '无'}</span>
              </li>
              <li>
                代理等级{' '}
                <span>
                  {info.level === 1
                    ? '总代理'
                    : info.level === 2
                    ? '1级代理'
                    : info.level === 3
                    ? '2级代理'
                    : info.level === 4
                    ? '3级代理'
                    : '无'}
                </span>
              </li>
              <li>
                联系人<span>{info.realname ? info.realname : '无'}</span>
              </li>
              <li>
                上级代理
                <span>
                  {info.parentName ? info.parentName : info.level === 1 ? '平台直属' : '无'}
                </span>
              </li>
              <li>
                负责区域<span>{info.area ? info.area : '无'}</span>
              </li>
            </ul>
            <ul>
              <li>
                代理状态
                <span>{info.state === 0 ? '已关联' : info.state === 1 ? '未关联' : '无'}</span>
              </li>
              <li>
                分润比例 <span>{info.reward || info.reward === 0 ? info.reward + '%' : '无'}</span>
              </li>
              <li>
                联系方式<span>{info.mobile ? info.mobile : '无'}</span>
              </li>
              <li>
                上级代理联系方式<span>{info.parentPhone ? info.parentPhone : '无'}</span>
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
