import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Input,
  Button,
  Form,
  Divider,
  Tabs,
  message,
  Popconfirm,
  InputNumber,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const TabPane = Tabs.TabPane;

@connect(({ lose, loading }) => ({
  lose,
  loading: loading.models.lose,
}))
@Form.create()
class Lost extends Component {
  state = {
    details: {},
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    deviceId: '',
    sellerContact: '',
    startHours: '',
    endHours: '',
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

  getLose(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'lose/lost',
      payload: {
        condition: {
          deviceId: this.state.deviceId,
          sellerContact: this.state.sellerContact,
          startHours: this.state.startHours,
          endHours: this.state.endHours,
          state: -2,
        },
        desc: true,
        nowPage: page,
        orderCondition: [],
        pageSize: 10,
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
        }
      },
    });
  }

  getDetails(id) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'lose/details',
      payload: { id: id },
      callback: function(res) {
        if (res.data) {
          z.setState({
            details: res.data,
          });
        }
      },
    });
  }

  componentDidMount() {
    this.getLose(1);
  }

  returned = record => {
    console.log(record);
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'lose/retrievePut',
      payload: {
        id: record.deviceId,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getLose(z.state.current);
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // deviceId sellerTel oneTel
      // Should format date value before submit.
      const deviceId = fieldsValue['deviceId'];
      const seller = fieldsValue['seller'];
      const startTime = fieldsValue['starTime'];
      const endTime = fieldsValue['endTime'];
      this.setState(
        {
          deviceId: deviceId,
          sellerContact: seller,
          startHours: startTime,
          endHours: endTime,
        },
        () => {
          this.getLose(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        deviceId: '',
        sellerContact: '',
        startHours: '',
        endHours: '',
      },
      () => {
        this.getLose(1);
      }
    );
  };

  details = (text, record) => {
    this.getDetails(record.deviceId);
    this.setState({ activeKey: '2' });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
  };

  type = type => {
    if (type === 0) {
      return '未冻结';
    } else if (type === 1) {
      return '未解冻';
    } else if (type === 2) {
      return '待回款';
    } else if (type === 3) {
      return '已回款';
    } else {
      return type;
    }
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.lose.lost ? this.props.lose.lost.list : [];

    const columns = [
      {
        width: '150',
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'left',
        render: (text, record) => (
          <span>
            <Popconfirm
              title={`是否找回编号为${record.deviceId}的设备？`}
              onConfirm={() => this.returned(record)}
            >
              <a href="javascript:;">找回</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
          </span>
        ),
      },
      {
        title: '遗失时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '设备编号',
        dataIndex: 'deviceId',
        key: 'deviceId',
      },
      {
        title: '运行状态',
        dataIndex: 'state',
        key: 'state',
        render: key => <span>{key === 1 ? '在线' : '离线'}</span>,
      },
      {
        title: '持续离线时长',
        dataIndex: 'offlineMinutes',
        key: 'offlineMinutes',
      },
      {
        title: '冻结状态',
        dataIndex: 'isFreeze',
        key: 'isFreeze',
        render: key => {
          if (key === 1) {
            return <span>未解冻</span>;
          } else if (key === 2) {
            return <span>待回款</span>;
          } else if (key === 3) {
            return <span>已回款</span>;
          } else if (key === 0) {
            return <span>未冻结</span>;
          } else {
            return key;
          }
        },
      },
      {
        title: '详细地址',
        dataIndex: 'boxAddress',
        key: 'boxAddress',
      },
      {
        title: '设备单价',
        dataIndex: 'details',
        key: 'details',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        render: key => <span>{key + '口' + (key - 1) + '台'}</span>,
      },
      {
        title: '商户名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '商户联系人',
        dataIndex: 'sellerContactMan',
        key: 'sellerContactMan',
      },
      {
        title: '联系方式',
        dataIndex: 'sellerContact',
        key: 'sellerContact',
      },
      {
        title: '批次',
        dataIndex: 'batchName',
        key: 'batchName',
      },
      {
        title: '充电宝数量',
        dataIndex: 'surplusTeminalCount',
        key: 'surplusTeminalCount',
      },
      {
        title: '累计盈利金额（元）',
        dataIndex: 'allRealPaySum',
        key: 'allRealPaySum',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '累计订单量',
        dataIndex: 'allOrderNum',
        key: 'allOrderNum',
      },
      {
        title: '昨日订单金额（元）',
        dataIndex: 'yesterdayRealPaySum',
        key: 'yesterdayRealPaySum',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '昨日订单量',
        dataIndex: 'yesterdayOrderNum',
        key: 'yesterdayOrderNum',
      },
      {
        title: '冻结金额',
        dataIndex: 'freezeMoney',
        key: 'freezeMoney',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '已解冻金额',
        dataIndex: 'unfreezeMoney',
        key: 'unfreezeMoney',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '安装日期',
        dataIndex: 'installTime',
        key: 'installTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function pageChange(page) {
      z.getLose(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.tabPane}>
            <Row>
              <Col className={styles.col}>
                <Form className={styles.form}>
                  <Form.Item className={styles.form} label={'设备编号'}>
                    {getFieldDecorator('deviceId', {})(
                      <Input placeholder="请输入设备编号进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label={'商户联系方式'}>
                    {getFieldDecorator('seller', {})(
                      <Input placeholder="请输入商户联系方式进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label={'持续离线时长'}>
                    {getFieldDecorator('starTime', {})(
                      <InputNumber placeholder="小时" className={styles.smallInput} min={0} />
                    )}
                  </Form.Item>
                  <span className={styles.space}> - </span>
                  <Form.Item className={styles.form}>
                    {getFieldDecorator('endTime', {})(
                      <InputNumber placeholder="小时" className={styles.smallInput} min={0} />
                    )}
                  </Form.Item>
                </Form>
                <Button
                  type="primary"
                  icon="search"
                  className={styles.btn}
                  onClick={this.handleSubmit}
                >
                  搜索
                </Button>
                <Button
                  icon="reload"
                  type="primary"
                  onClick={this.handleClearSearch}
                  className={styles.btn}
                >
                  重置
                </Button>
              </Col>
              <Table
                pagination={{
                  defaultCurrent: 1,
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: pageChange,
                  showTotal: () => {
                    return (
                      <div className={selfStyle.total}>
                        <p>共计：{this.state.total} 条</p>
                      </div>
                    );
                  },
                }}
                loading={this.state.loading}
                className={styles.table}
                rowKey={'deviceId'}
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={columns}
              />
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.tabPane}>
            <Row type="flex" justify="start" className={styles.bgc}>
              <ChartCard
                className={styles.card}
                title="累计订单金额（元）"
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: this.toDecimal(this.state.details.rentPriceSum / 100),
                    }}
                  />
                )}
              />
              <ChartCard
                className={styles.card}
                title="累计订单量"
                total={this.state.details.orderNum || 0}
              />
              <ChartCard
                className={styles.card}
                title="本月订单金额（元）"
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: this.toDecimal(this.state.details.monthPriceSum / 100) || 0,
                    }}
                  />
                )}
              />
              <ChartCard
                className={styles.card}
                title="本月订单量"
                total={this.state.details.monthOrderNum || 0}
              />
              <ChartCard
                className={styles.card}
                title="昨日订单金额（元）"
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: this.toDecimal(this.state.details.yesterdayMoneySum / 100) || 0,
                    }}
                  />
                )}
              />
              <ChartCard
                className={styles.card}
                title="昨日订单量"
                total={this.state.details.yesterdayCount || 0}
              />
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>基本信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>设备编号 : {this.state.details.deviceId || '无'}</Col>
              <Col className={styles.right}>批次 : {this.state.details.batchName || '无'}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                设备状态 : {this.type(this.state.details.deviceState) || '无'}
              </Col>
              <Col className={styles.right}>详细地址 : {this.state.details.boxAddress || '无'}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                经纬度 :{' '}
                {this.state.details.longitude && this.state.details.latitude
                  ? this.state.details.longitude + ',' + this.state.details.latitude
                  : '无'}
              </Col>
              <Col className={styles.right}>
                设备单价 : {this.toDecimal(this.state.details.details / 100)}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                已解冻金额 :{' '}
                {this.state.details.unfreezeMoney || this.state.details.unfreezeMoney === 0
                  ? this.toDecimal(this.state.details.unfreezeMoney / 100)
                  : '无'}
              </Col>
              <Col className={styles.right}>
                冻结金额 :{' '}
                {this.state.details.freezeMoney || this.state.details.freezeMoney === 0
                  ? this.toDecimal(this.state.details.freezeMoney / 100)
                  : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                累计离线时长 : {this.state.details.offLineTime || '无'}
              </Col>
              <Col className={styles.right}>
                累计在线时长 : {this.state.details.onLineTime || '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>分润比例 : {this.state.details.boxReward || '无'}</Col>
              <Col className={styles.right}>
                充电宝数量 : {this.state.details.deviceNum || '无'}
              </Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>持有人信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>商户名称 : {this.state.details.sellerName || '无'}</Col>
              <Col className={styles.right}>
                绑定时间 :{' '}
                {this.state.details.sellerBindTime
                  ? moment(this.state.details.sellerBindTime).format('YYYY-MM-DD HH:mm:ss')
                  : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                联系方式 : {this.state.details.sellerLinkTel || '无'}
              </Col>
              <Col className={styles.right}>
                联系人 : {this.state.details.sellerLinkName || '无'}
              </Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>安装人信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>安装人 : {this.state.details.installName || '无'}</Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.installMobile || '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col>
                安装日期 :
                {this.state.details.installTime
                  ? moment(this.state.details.installTime).format('YYYY-MM-DD HH:mm:ss')
                  : '无'}
              </Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>代理关系</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.w200}>总代理 : {this.state.details.oneAgentName || '无'}</Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.oneAgentLinkTel || '无'}
              </Col>
              <Col className={styles.right}>
                总代理分润比例 :{' '}
                {this.state.details.oneAgentReward ? this.state.details.oneAgentReward + '%' : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.w200}>1级代理 : {this.state.details.twoAgentName || '无'}</Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.twoAgentPhone || '无'}
              </Col>
              <Col className={styles.right}>
                1级代理分润比例 :{' '}
                {this.state.details.twoReward ? this.state.details.twoReward + '%' : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.w200}>
                2级代理 : {this.state.details.threeAgentName || '无'}
              </Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.threeAgentPhone || '无'}
              </Col>
              <Col className={styles.right}>
                2级代理分润比例 :{' '}
                {this.state.details.threeAgentReward
                  ? this.state.details.threeAgentReward + '%'
                  : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.w200}>
                3级代理 : {this.state.details.fourAgentName || '无'}
              </Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.fourAgentPhone || '无'}
              </Col>
              <Col className={styles.right}>
                3级代理分润比例 :{' '}
                {this.state.details.fourAgentReward
                  ? this.state.details.fourAgentReward + '%'
                  : '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.w200}>商户 : {this.state.details.sellerLinkName || '无'}</Col>
              <Col className={styles.right}>
                联系方式 : {this.state.details.sellerLinkTel || '无'}
              </Col>
              <Col className={styles.right}>
                商户分润比例 :{' '}
                {this.state.details.sellerReward ? this.state.details.sellerReward + '%' : '无'}
              </Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row justify="start" type="flex" className={styles.line}>
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Lost;
