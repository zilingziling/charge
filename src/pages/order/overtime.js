import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Form } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const { RangePicker } = DatePicker;

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class Overtime extends Component {
  state = {
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
      type: 'order/overtime',
      payload: {
        condition: {
          type: 2,
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
    const dataSource = this.props.order.overtime ? this.props.order.overtime.list : [];

    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '支付渠道',
        dataIndex: 'payType',
        key: 'payType',
        render: key => <span>{key === '2' ? '支付宝' : '微信'}</span>,
      },
      {
        title: '用户编号',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '用户联系方式',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '预付款（元）',
        dataIndex: 'advancePay',
        key: 'advancePay',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '设备单价(元)',
        dataIndex: 'details',
        key: 'details',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '超时时间',
        dataIndex: 'updTime',
        key: 'updTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '扣除违约金（元）',
        dataIndex: 'realPayment',
        key: 'realPayment',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '出借商户名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '出借时间',
        dataIndex: 'rentTime',
        key: 'rentTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '出借地点',
        dataIndex: 'rentAddress',
        key: 'rentAddress',
      },
      {
        title: '出借设备编号',
        dataIndex: 'deviceId',
        key: 'deviceId',
      },
      {
        title: '订单结束时间',
        dataIndex: 'returnTime',
        key: 'returnTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '订单创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function onChange(date, dateString) {}

    function pageChange(page, pageSize) {
      z.getOrder(page);
    }

    return (
      <div>
        <Row className={styles.bgc}>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form} label="订单号">
                {getFieldDecorator('orderId', {})(
                  <Input placeholder="请输入订单号进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="创建时间">
                {getFieldDecorator('range-picker', {})(<RangePicker onChange={onChange} />)}
              </Form.Item>
            </Form>
            <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
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
            loading={this.state.loading}
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
            rowKey="id"
            bordered
            scroll={{ x: 1000 }}
            dataSource={dataSource}
            columns={columns}
          />
        </Row>
      </div>
    );
  }
}

export default Overtime;
