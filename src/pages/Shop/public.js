import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Form, message, Popconfirm, Tabs } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Divider from 'antd/es/divider';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class Public extends Component {
  state = {
    details: {},
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    orderId: '',
    staTime: '',
    endTime: '',
    loading: false,
  };

  getOrder(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/underway',
      payload: {
        condition: {
          type: 1,
          orderId: this.state.orderId,
          staTime: this.state.staTime,
          endTime: this.state.endTime,
        },
        desc: true,
        nowPage: page,
        orderCondition: ['id'],
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

  overOrder = record => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/overOrder',
      payload: {
        id: record.id,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getOrder(z.state.current);
      },
    });
  };

  componentDidMount() {
    this.getOrder(1);
  }

  handleSubmit = e => {
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

  callback = key => {
    this.setState({ activeKey: key });
  };

  list = () => {
    this.setState({ activeKey: '1' });
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
    const dataSource = this.props.order.underway ? this.props.order.underway.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;">查看设备</a>
            <Divider />
            <a href="javascript:;">详情</a>
          </span>
        ),
      },
      {
        title: '门头照片',
        key: 'photo',
        render: (text, record) => (
          <span>
            <a href="javascript:;">查看</a>
          </span>
        ),
      },
      {
        title: '等级',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '门店ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '门店名称',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '所在地区',
        dataIndex: 'advancePay',
        key: 'advancePay',
      },
      {
        title: '门店品类',
        dataIndex: 'details',
        key: 'details',
      },
      {
        title: '是否连锁',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: 'BD姓名',
        dataIndex: 'rentTime',
        key: 'rentTime',
      },
      {
        title: 'BD电话',
        dataIndex: 'rentAddress',
        key: 'rentAddress',
      },
      {
        title: '创建时间',
        dataIndex: 'deviceId',
        key: 'deviceId',
      },
    ];

    const information = [
      {
        title: '绑定时间',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '解绑时间',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '商户ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '商户名称',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '主体名称',
        dataIndex: 'advancePay',
        key: 'advancePay',
      },
      {
        title: '商户联系方式',
        dataIndex: 'details',
        key: 'details',
      },
    ];

    const record = [
      {
        title: '时间',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '动作',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '操作人类型',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '操作人',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '操作人联系方式',
        dataIndex: 'advancePay',
        key: 'advancePay',
      },
      {
        title: '备注',
        dataIndex: 'details',
        key: 'details',
      },
    ];

    function onChange(date, dateString) {}

    function pageChange(page) {
      z.getOrder(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.pane}>
            <Row className={styles.bgc}>
              <Col className={styles.col}>
                <Form className={styles.form}>
                  <Form.Item className={styles.form} label="门店名称">
                    {getFieldDecorator('orderId', {})(
                      <Input placeholder="请输入订单号进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="所在地区">
                    {getFieldDecorator('BD', {})(
                      <Input placeholder="请输入订单号进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="品类">
                    {getFieldDecorator('BD', {})(
                      <Input placeholder="请输入订单号进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="抛入时间">
                    {getFieldDecorator('range-picker', {})(<RangePicker onChange={onChange} />)}
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
                <Button type="danger" onClick={this.handleClearSearch} className={styles.btn}>
                  重置
                </Button>
              </Col>
              <Table
                className={styles.table}
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
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={columns}
              />
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.pane}>
            <Row className={styles.title}>基础信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>门店ID : {this.state.details.id}</Col>
              <Col className={styles.right}>门店名称 : {this.state.details.userId}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>所在地区 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>详细地址 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>门店品类 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>是否连锁店 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>门店负责人 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>联系电话 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>营业时间 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>门店单价 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>BD/代理电话 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>
                BD/代理姓名 : {this.state.details.returnSellerName}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>类型 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>门店等级 : {this.state.details.returnSellerName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col>门头照片 : </Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>历史商户信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Table
                className={styles.table}
                pagination={{
                  defaultCurrent: 1,
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: pageChange,
                }}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={information}
                size="small"
              />
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row className={styles.title}>门店流转记录</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Table
                className={styles.table}
                pagination={{
                  defaultCurrent: 1,
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: pageChange,
                }}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={record}
                size="small"
              />
            </Row>

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

export default Public;
