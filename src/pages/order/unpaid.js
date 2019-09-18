import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Divider,
  Tabs,
  Form,
  message,
  Popconfirm,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from '@/pages/order/global.css';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class Unpaid extends Component {
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
      type: 'order/unpaid',
      payload: {
        condition: {
          type: -1,
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
          console.log(res);
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
        if (res.data) {
          z.setState({
            details: res.data,
          });
        }
      },
    });
  }

  scrapOrder = record => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/scrapOrder',
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
    const dataSource = this.props.order.unpaid ? this.props.order.unpaid.list : [];
    console.log(dataSource);

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'left',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title={`是否废弃订单号为${record.id}的订单？`}
              onConfirm={() => this.scrapOrder(record)}
            >
              <a href="javascript:;">废弃订单</a>
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
        title: '租借时长',
        dataIndex: 'continueTime',
        key: 'continueTime',
        // render: (key) => (
        //   <span>
        //       {key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}
        //   </span>
        // ),
      },
      {
        title: '租借金额（元）',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
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
        title: '归还商户名称',
        dataIndex: 'returnSellerName',
        key: 'returnSellerName',
      },
      {
        title: '归还时间',
        dataIndex: 'returnTime',
        key: 'returnTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '归还地点',
        dataIndex: 'returnAddress',
        key: 'returnAddress',
      },
      {
        title: '归还设备编号',
        dataIndex: 'returnBoxid',
        key: 'returnBoxid',
      },
      {
        title: '订单创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function onChange(date, dateString) {
      console.log(date, dateString);
    }

    function pageChange(page, pageSize) {
      console.log(page, pageSize);
      z.getOrder(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.pane}>
            <Row>
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
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.pane}>
            <Row className={styles.title}>使用详情</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>订单号 : {this.state.details.id}</Col>
              <Col className={styles.right}>用户编号 : {this.state.details.userId}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>出借商户名称 : {this.state.details.sellerName}</Col>
              <Col className={styles.right}>
                归还商户名称 : {this.state.details.returnSellerName}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                出借时间 :{' '}
                {this.state.details.rentTime
                  ? moment(this.state.details.rentTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Col>
              <Col className={styles.right}>
                归还时间 :{' '}
                {this.state.details.returnTime
                  ? moment(this.state.details.returnTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>出借地点 : {this.state.details.rentAddress}</Col>
              <Col className={styles.right}>归还地点 : {this.state.details.returnAddress}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>出借设备编号 : {this.state.details.deviceId}</Col>
              <Col className={styles.right}>归还设备编号 : {this.state.details.returnBoxid}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />

            <Row className={styles.title}>价格明细</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>租借时长 : {this.state.details.continueTime}</Col>
              <Col className={styles.right}>
                订单创建时间 :{' '}
                {this.state.details.rentTime
                  ? moment(this.state.details.rentTime).format('YYYY-MM-DD HH:mm:ss')
                  : ''}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                租金总额 :{' '}
                {this.state.details.rentPrice
                  ? this.toDecimal(this.state.details.rentPrice / 100)
                  : 0.0}
              </Col>
              <Col className={styles.right}>
                预付金额 :{' '}
                {this.state.details.advancePay
                  ? this.toDecimal(this.state.details.advancePay / 100)
                  : 0.0}
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

export default Unpaid;
