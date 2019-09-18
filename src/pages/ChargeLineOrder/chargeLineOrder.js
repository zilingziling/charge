import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Divider, Tabs, Form, Icon } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class ChargeLineOrder extends Component {
  state = {
    moreSearch: false,
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    orderId: '',
    staTime: '',
    endTime: '',
    details: {},
    loading: false,
  };

  getOrder(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/prepaid',
      payload: {
        condition: {
          type: 0,
          orderId: this.state.orderId,
          staTime: this.state.staTime,
          endTime: this.state.endTime,
        },
        desc: true,
        nowPage: page,
        orderCondition: ['id'],
        pageSize: z.state.pageSize,
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

  getOrderDetails(id) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/orderDetails',
      payload: { id: id },
      callback: function(res) {
        if (res.code === '999999') {
        }
        if (res.data) {
          z.setState({
            details: res.data,
          });
        }
      },
    });
  }

  componentDidMount() {
    this.getOrder(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const rangeValue = fieldsValue['range-picker'];
      const orderId = fieldsValue['orderId'];
      this.setState(
        {
          orderId: orderId,
          staTime: rangeValue ? (rangeValue[0] ? rangeValue[0].format('YYYY-MM-DD') : '') : '',
          endTime: rangeValue ? (rangeValue[1] ? rangeValue[1].format('YYYY-MM-DD') : '') : '',
        },
        () => {
          this.getOrder(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        orderId: '',
        staTime: '',
        endTime: '',
      },
      () => {
        this.getOrder(1);
      }
    );
  };

  details = (text, record) => {
    this.getOrderDetails(record.id);
    this.setState({ activeKey: '2' });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
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

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.order.prepaid ? this.props.order.prepaid.list : [];

    const columns = [
      {
        title: '操作',
        fixed: 'left',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
          </span>
        ),
      },
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '支付订单号',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '订单状态',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '是否退款',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '订单渠道',
        dataIndex: 'advancePay',
        key: 'advancePay',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '客户昵称',
        dataIndex: 'details',
        key: 'details',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '手机号码',
        dataIndex: 'continueTime',
        key: 'continueTime',
        // render: (key) => (
        //   <span>
        //       {key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}
        //   </span>
        // ),
      },
      {
        title: '租借时长',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '订单金额',
        dataIndex: 'realPayment',
        key: 'realPayment',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '实付金额',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '优惠金额',
        dataIndex: 'rentTime',
        key: 'rentTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '已退款金额',
        dataIndex: 'rentAddress',
        key: 'rentAddress',
      },
      {
        title: '出借门店',
        dataIndex: 'deviceId',
        key: 'deviceId',
      },
      {
        title: '订单支付时间',
        dataIndex: 'returnSellerName',
        key: 'returnSellerName',
      },
    ];

    function onChange(date, dateString) {}

    function pageChange(page, pageSize) {
      z.getOrder(page);
    }

    function onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      z.setState(
        {
          current: current,
          pageSize: pageSize,
        },
        () => {
          z.getOrder(1);
        }
      );
    }

    function moreButton() {
      z.setState({
        moreSearch: !z.state.moreSearch,
      });
    }

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: onShowSizeChange,
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
    };

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.pane}>
            <Form>
              <Row className={styles.searchLine}>
                <Form.Item className={styles.form} label="订单号">
                  {getFieldDecorator('orderId', {})(
                    <Input placeholder="请输入订单号进行搜索" className={styles.input} />
                  )}
                </Form.Item>
                <Form.Item className={styles.form} label="支付渠道">
                  {getFieldDecorator('orderId', {})(
                    <Input placeholder="请选择支付渠道" className={styles.input} />
                  )}
                </Form.Item>
                <Form.Item className={styles.form} label="订单状态">
                  {getFieldDecorator('orderId', {})(
                    <Input placeholder="请选择订单状态" className={styles.input} />
                  )}
                </Form.Item>
                <Button
                  type="primary"
                  icon="search"
                  className={styles.btn}
                  onClick={this.handleSubmit}
                >
                  搜索
                </Button>
                <div className={styles.moreButton} onClick={moreButton}>
                  <span className={styles.moreButtonText}>更多</span>
                  {this.state.moreSearch ? (
                    <Icon type="caret-up" theme="filled" />
                  ) : (
                    <Icon type="caret-down" theme="filled" />
                  )}
                </div>
              </Row>
              {this.state.moreSearch ? (
                <Row className={styles.searchLine}>
                  <Form.Item className={styles.form} label="出借门店">
                    {getFieldDecorator('orderId', {})(
                      <Input placeholder="请输入出借门店进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="是否退款">
                    {getFieldDecorator('orderId', {})(
                      <Input placeholder="请选择是否退款" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="创建时间">
                    {getFieldDecorator('range-picker', {})(<RangePicker onChange={onChange} />)}
                  </Form.Item>
                </Row>
              ) : (
                ''
              )}
            </Form>
            <Row>
              <Table
                loading={this.state.loading}
                className={styles.table}
                pagination={pagination}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={columns}
              />
            </Row>

            <Row className={styles.buttonBox}>
              <Button
                icon="reload"
                type="primary"
                onClick={this.handleClearSearch}
                className={styles.btn}
              >
                重置
              </Button>
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.pane} disabled>
            <Row className={styles.title}>使用详情</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>订单号 : {this.state.details.id}</Col>
              <Col className={styles.right}>支付订单号 : {this.state.details.userId}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>订单渠道 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>订单状态 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                套餐名称 :{' '}
                {this.state.details.rentTime
                  ? moment(this.state.details.rentTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Col>
              <Col className={styles.right}>
                订单金额 :{' '}
                {this.state.details.returnTime
                  ? moment(this.state.details.returnTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>优惠金额 : {this.state.details.rentAddress}</Col>
              <Col className={styles.right}>实付金额 : {this.state.details.returnAddress}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>租借时长 : {this.state.details.deviceId}</Col>
              <Col className={styles.right}>剩余时长 : {this.state.details.returnBoxid}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>订单支付时间 : {this.state.details.continueTime}</Col>
              <Col className={styles.right}>是否退款 : {this.state.details.rentTime}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>客户ID : {this.state.details.continueTime}</Col>
              <Col className={styles.right}>绑定手机号 : {this.state.details.rentTime}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />

            <Row className={styles.title}>出借信息</Row>

            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>商户名称 : {this.state.details.rentPrice}</Col>
              <Col className={styles.right}>商户编号 : {this.state.details.advancePay}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>门店名称 : {this.state.details.rentPrice}</Col>
              <Col className={styles.right}>门店编号 : {this.state.details.advancePay}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>门店所在地区 : {this.state.details.rentPrice}</Col>
              <Col className={styles.right}>详细地址 : {this.state.details.advancePay}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>充电线编号 : {this.state.details.rentPrice}</Col>
            </Row>

            <Divider style={{ marginBottom: 32 }} />

            <Row className={styles.title}>BD/代理信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>BD/代理名称 : {this.state.details.rentPrice}</Col>
              <Col className={styles.right}>BD/代理联系方式 : {this.state.details.advancePay}</Col>
            </Row>

            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>优惠信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>优惠方式 : {this.state.details.rentPrice}</Col>
              <Col className={styles.right}>优惠金额 : {this.state.details.advancePay}</Col>
            </Row>

            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>退款记录 </Row>
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

export default ChargeLineOrder;
