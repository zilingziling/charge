import React, { Component } from 'react';
import { Row, Col, Card,Tooltip } from 'antd';
import { ChartCard, Pie, Bar } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './Analysis.less';
import { connect } from 'dva';
import moment from 'moment';
import Button from 'antd/es/button';
import Spin from 'antd/es/spin';
import { formatterNum } from '@/utils/handleNumber';

@connect(({ index, loading }) => ({
  index,
  loading: loading.models.index,
}))
class Analysis extends Component {
  state = {
    waitHandle: {},
    loading: false,
  };

  toDecimal(x) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }

  getWaitHandle() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/waitHandle',
    });
  }

  getOrder() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/order',
    });
  }

  getDevice() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/device',
    });
  }

  getUser() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/user',
    });
  }

  getAgent() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/agent',
    });
  }

  moneyEcharts() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'index/moneyEcharts',
      callback: function(res) {
        z.setState({ loading: false });
      },
    });
  }

  componentDidMount() {
    this.getWaitHandle();
    this.getOrder();
    this.getDevice();
    this.getUser();
    this.getAgent();
    this.moneyEcharts();
  }

  redo = () => {
    this.setState({
      loading: true,
    });
    this.getWaitHandle();
    this.getOrder();
    this.getDevice();
    this.getUser();
    this.getAgent();
    this.moneyEcharts();
  };

  render() {
    const moneyEcharts = this.props.index.moneyEcharts ? this.props.index.moneyEcharts : [];
    const salesData = [
      {
        x: moneyEcharts[0] ? moneyEcharts[0].staticsDay : 0,
        y: moneyEcharts[0] ? moneyEcharts[0].priceSum : 0,
      },
      {
        x: moneyEcharts[1] ? moneyEcharts[1].staticsDay : 0,
        y: moneyEcharts[1] ? moneyEcharts[1].priceSum : 0,
      },
      {
        x: moneyEcharts[2] ? moneyEcharts[2].staticsDay : 0,
        y: moneyEcharts[2] ? moneyEcharts[2].priceSum : 0,
      },
      {
        x: moneyEcharts[3] ? moneyEcharts[3].staticsDay : 0,
        y: moneyEcharts[3] ? moneyEcharts[3].priceSum : 0,
      },
      {
        x: moneyEcharts[4] ? moneyEcharts[4].staticsDay : 0,
        y: moneyEcharts[4] ? moneyEcharts[4].priceSum : 0,
      },
      {
        x: moneyEcharts[5] ? moneyEcharts[5].staticsDay : 0,
        y: moneyEcharts[5] ? moneyEcharts[5].priceSum : 0,
      },
      {
        x: moneyEcharts[6] ? moneyEcharts[6].staticsDay : 0,
        y: moneyEcharts[6] ? moneyEcharts[6].priceSum : 0,
      },
    ];

    const salesPieData = [
      {
        x: '未出库设备',
        y: parseInt(this.props.index.device.waitInvent) || 0,
      },
      {
        x: '未部署设备',
        y: parseInt(this.props.index.device.waitInstall) || 0,
      },
      {
        x: '已部署设备',
        y: parseInt(this.props.index.device.installed) || 0,
      },
    ];

    const salesPieData2 = [
      {
        x: '微信用户',
        y: parseInt(this.props.index.user.wechat) || 0,
      },
      {
        x: '支付宝用户',
        y: parseInt(this.props.index.user.aliPay) || 0,
      },
    ];

    const salesPieData3 = [
      {
        x: '总代理',
        y: this.props.index.agent.generalAgent || 0,
      },
      {
        x: '一级代理',
        y: this.props.index.agent.oneAgent || 0,
      },
      {
        x: '二级代理',
        y: this.props.index.agent.twoAgent || 0,
      },
      {
        x: '三级代理',
        y: this.props.index.agent.threeAgent || 0,
      },
    ];
    const {allMoneySum}=this.props.index.order
    return (
      <div className={styles.box}>
        <Row>
          <Button className={styles.button} type="primary" icon="redo" onClick={this.redo}>
            刷新
          </Button>
        </Row>
        <Spin spinning={this.state.loading}>
          <Row type="flex" justify="space-between">
            <Card title="待办事项" bordered={false} style={{ width: '45%' }}>
              <ChartCard
                className={styles.card}
                title="提现待审核"
                total={this.props.index.waitHandle.withdraw || 0}
              />
              <ChartCard
                className={styles.card}
                title="设备待回款"
                total={this.props.index.waitHandle.moneyReturn || 0}
              />
              <ChartCard
                className={styles.card}
                title="报修待处理"
                total={this.props.index.waitHandle.repair || 0}
              />
              {/*<ChartCard*/}
              {/*  className={styles.card}*/}
              {/*  title="解绑待审核"*/}
              {/*  total={this.props.index.waitHandle.cancelBind}*/}
              {/*/>*/}
              <ChartCard
                className={styles.card}
                title="商户总量"
                total={formatterNum(this.props.index.waitHandle.sellerSum,true)}
              />
            </Card>
            <Card title="订单统计" bordered={false} style={{ width: '54%' }}>
              <ChartCard
                className={styles.card}
                title="昨日订单总量"
                total={this.props.index.order.yesterdayCountSum || 0}
              />
              <ChartCard
                className={styles.card}
                title="昨日订单总额"
                total={this.toDecimal(this.props.index.order.yesterdayMoneySum / 100)}
              />
              <ChartCard
                className={styles.card}
                title="累计订单量"
                total={formatterNum(this.props.index.order.allCountSum,true)}
              />
              <ChartCard
                className={styles.card}
                title="累计订单总额"
                total={formatterNum(allMoneySum)}
              />
            </Card>
          </Row>
          <Card>
            <Row type="flex" gutter={{ xs: 8, sm: 24, md: 24 }} className={styles.line}>
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Pie
                  height={300}
                  className={styles.pie}
                  hasLegend
                  title="设备总量"
                  subTitle="设备总量"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.props.index.device.deviceCountSum || 0,
                      }}
                    />
                  )}
                  data={salesPieData}
                  valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                />
              </Col>
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Pie
                  height={300}
                  className={styles.pie}
                  hasLegend
                  title="C端用户总量"
                  subTitle="C端用户总量"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.props.index.user.userCountSum || 0,
                      }}
                    />
                  )}
                  data={salesPieData2}
                  valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                />
              </Col>
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Pie
                  height={300}
                  className={styles.pie}
                  hasLegend
                  title="代理总量"
                  subTitle="代理总量"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: this.props.index.agent.agentNumSum || 0,
                      }}
                    />
                  )}
                  data={salesPieData3}
                  valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
                />
              </Col>
            </Row>
          </Card>
          <Row className={styles.bar}>
            <Bar height={300} title="最近七天订单金额走势图" data={salesData} />
          </Row>
        </Spin>
      </div>
    );
  }
}

export default Analysis;
