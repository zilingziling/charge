import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Form, message, Popconfirm } from 'antd';
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
class Underway extends Component {
  state = {
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
        fixed: 'left',
        render: (text, record) => (
          <span>
            <Popconfirm
              title={`是否强制结束订单号为${record.id}的订单？`}
              onConfirm={() => this.overOrder(record)}
            >
              <a href="javascript:;">强制结束</a>
            </Popconfirm>
          </span>
        ),
      },
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
        title: '商户名称',
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
        title: '租借总时长',
        dataIndex: 'continueTime',
        key: 'continueTime',
        // render: (key) => (
        //   <span>
        //       {key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}
        //   </span>
        // ),
      },
      {
        title: '订单创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function onChange(date, dateString) {}

    function pageChange(page) {
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
      </div>
    );
  }
}

export default Underway;
