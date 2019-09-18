import React, { Component } from 'react';
import styles from './details.less';
import { Card, Button } from 'antd';
import moment from 'moment';
class Details extends Component {
  handleReturn = () => {
    const { clickReturnBtn } = this.props;
    clickReturnBtn();
  };
  render() {
    const { info } = this.props;
    const status = function() {
      switch (info.deviceState) {
        case -1:
          return '故障';
        case 0:
          return '离线';
        case 1:
          return '在线';
        default:
          return '无';
      }
    };
    return (
      <div className={styles.wrapper}>
        <Card style={{ marginTop: '20px' }}>
          <ul className={styles.infoCard}>
            <li>
              <p>累计订单金额</p>
              <h1>
                {info.rentPriceSum || info.rentPriceSum === 0
                  ? (info.rentPriceSum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
            <li>
              <p>累计订单量</p>
              <h1>{info.orderNum || info.orderNum === 0 ? info.orderNum : '无'}</h1>
            </li>
            <li>
              <p>本月订单金额</p>
              <h1>
                {info.rentPriceSum || info.rentPriceSum === 0
                  ? (info.rentPriceSum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
            <li>
              <p>本月订单量</p>
              <h1>{info.monthOrderNum || info.monthOrderNum === 0 ? info.monthOrderNum : '无'}</h1>
            </li>
            <li>
              <p>昨日订单金额</p>
              <h1>
                {info.yesterdayMoneySum || info.yesterdayMoneySum === 0
                  ? (info.yesterdayMoneySum / 100).toFixed(2)
                  : '无'}
              </h1>
            </li>
            <li>
              <p>昨日订单量</p>
              <h1>
                {info.yesterdayCount || info.yesterdayCount === 0 ? info.yesterdayCount : '无'}
              </h1>
            </li>
          </ul>
        </Card>
        <Card className={styles.basicCard} title="基本信息">
          <ul>
            <li>
              <p>设备编号</p>
              <span>{info.deviceId ? info.deviceId : '无'}</span>
            </li>

            <li>
              <p>设备状态</p>
              <span>{status()}</span>
            </li>
            <li>
              <p>经纬度</p>
              <span>
                {info.longitude && info.latitude
                  ? '(' + info.longitude + ' , ' + info.latitude + ')'
                  : '无'}
              </span>
            </li>
            <li>
              <p>已解冻金额</p>
              <span>
                {info.unfreezeMoney || info.unfreezeMoney === 0
                  ? (info.unfreezeMoney / 100).toFixed(2)
                  : '无'}
              </span>
            </li>
            <li>
              <p>持续离线时长</p>
              <span>{info.offLineTime || info.offLineTime === 0 ? info.offLineTime : '无'}</span>
            </li>
            <li>
              <p>分润比例</p>
              <span>{info.boxReward || info.boxReward === 0 ? info.boxReward + '%' : '无'}</span>
            </li>
          </ul>
          <ul>
            <li>
              <p>批次</p>
              <span>{info.batchName ? info.batchName : '无'}</span>
            </li>

            <li>
              <p>详细地址</p>
              <span>{info.boxAddress ? info.boxAddress : '无'}</span>
            </li>
            <li>
              <p>设备单价</p>
              <span>
                {info.details || info.details === 0 ? (info.details / 100).toFixed(2) : '无'}
              </span>
            </li>
            <li>
              <p>冻结金额</p>
              <span>
                {info.freezeMoney || info.freezeMoney === 0
                  ? (info.freezeMoney / 100).toFixed(2)
                  : '无'}
              </span>
            </li>
            <li>
              <p>累计在线时长</p>
              <span>{info.onLineTime || info.onLineTime === 0 ? info.onLineTime : '无'}</span>
            </li>
            <li>
              <p>充电宝数量</p>
              <span>{info.deviceNum || info.deviceNum === 0 ? info.deviceNum : '无'}</span>
            </li>
          </ul>
        </Card>
        <Card className={styles.ownerCard} title="持有人信息">
          <ul className={styles.inlineUl}>
            <li>
              <p>商户名称</p>
              <span>{info.sellerName ? info.sellerName : '无'}</span>
            </li>
            <li>
              <p>绑定时间</p>
              <span>
                {info.sellerBindTime
                  ? moment(info.sellerBindTime).format('YYYY/MM/DD HH:mm:ss')
                  : '无'}
              </span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.sellerLinkTel ? info.sellerLinkTel : '无'}</span>
            </li>
            <li>
              <p>联系人</p>
              <span>{info.sellerLinkName ? info.sellerLinkName : '无'}</span>
            </li>
          </ul>
        </Card>
        <Card style={{ marginTop: '20px' }} title="安装人信息">
          <ul className={styles.inlineUl}>
            <li>
              <p>安装人</p>
              <span>{info.installName ? info.installName : '无'}</span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.installMobile ? info.installMobile : '无'}</span>
            </li>
            <li>
              <p>安装日期</p>
              <span>
                {info.installTime ? moment(info.installTime).format('YYYY/MM/DD HH:mm:ss') : '无'}
              </span>
            </li>
          </ul>
        </Card>
        <Card className={styles.agentCard} title="代理关系">
          <ul className={styles.agentUl}>
            <li>
              <p>总代理</p>
              <span>{info.oneAgentName ? info.oneAgentName : '无'}</span>
            </li>
            <li>
              <p>1级代理</p>
              <span>{info.twoAgentName ? info.twoAgentName : '无'}</span>
            </li>
            <li>
              <p>2级代理</p>
              <span>{info.threeAgentName ? info.threeAgentName : '无'}</span>
            </li>
            <li>
              <p>3级代理</p>
              <span>{info.fourAgentName ? info.fourAgentName : '无'}</span>
            </li>
            <li>
              <p>商户</p>
              <span>{info.sellerName ? info.sellerName : '无'}</span>
            </li>
          </ul>
          <ul className={styles.agentUl}>
            <li>
              <p>联系方式</p>
              <span>{info.oneAgentLinkTel ? info.oneAgentLinkTel : '无'}</span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.twoAgentPhone ? info.twoAgentPhone : '无'}</span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.threeAgentPhone ? info.threeAgentPhone : '无'}</span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.fourAgentPhone ? info.fourAgentPhone : '无'}</span>
            </li>
            <li>
              <p>联系方式</p>
              <span>{info.sellerLinkTel ? info.sellerLinkTel : '无'}</span>
            </li>
          </ul>
          <ul className={styles.agentUl}>
            <li>
              <p>总代理分润比例</p>
              <span>
                {info.oneAgentReward || info.oneAgentReward === 0
                  ? info.oneAgentReward + '%'
                  : '无'}
              </span>
            </li>
            <li>
              <p>1级代理分润比例</p>
              <span>{info.twoReward || info.twoReward === 0 ? info.twoReward + '%' : '无'}</span>
            </li>
            <li>
              <p>2级代理分润比例</p>
              <span>
                {info.threeAgentReward || info.threeAgentReward === 0
                  ? info.threeAgentReward + '%'
                  : '无'}
              </span>
            </li>
            <li>
              <p>3级代理分润比例</p>
              <span>
                {info.fourAgentReward || info.fourAgentReward === 0
                  ? info.fourAgentReward + '%'
                  : '无'}
              </span>
            </li>
            <li>
              <p>商户分润比例</p>
              <span>
                {info.sellerReward || info.sellerReward === 0 ? info.sellerReward + '%' : '无'}
              </span>
            </li>
          </ul>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.handleReturn}>
            返回
          </Button>
        </div>
      </div>
    );
  }
}

export default Details;
