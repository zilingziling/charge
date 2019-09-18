import React, { useState, Component } from 'react';
import {
  Form,
  Table,
  Input,
  Select,
  Button,
  Card,
  Popconfirm,
  message,
  DatePicker,
  Tabs,
  Row,
} from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;

@connect(({ ReportForms, loading }) => ({
  ReportForms,
  loading: loading.models.ReportForms,
}))
@Form.create()
class OrderForm extends Component {
  state = {
    activeKey: '1',
    current: 1,
    pageSize: 11,
    total: 0,
    current2: 1,
    pageSize2: 10,
    total2: 0,
    loading: false,
    staTime: '',
    endTime: '',
    date: '',
    orderId: '',
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

  getReward(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'ReportForms/order',
      payload: {
        condition: {
          staTime: this.state.staTime,
          endTime: this.state.endTime,
        },
        desc: true,
        nowPage: page,
        orderCondition: [],
        pageSize: 11,
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

  getDay(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'ReportForms/orderDay',
      payload: {
        condition: {
          date: this.state.date,
          orderId: this.state.orderId,
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
            current2: res.data.pageIndex,
            pageSize2: res.data.pageSize,
            total2: res.data.total,
          });
        }
      },
    });
  }

  componentDidMount() {
    this.getReward(1);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // deviceId sellerTel oneTel
      // Should format date value before submit.
      const staTime = fieldsValue['staTime'];
      const endTime = fieldsValue['endTime'];
      this.setState(
        {
          staTime: staTime,
          endTime: endTime,
        },
        () => {
          this.getReward(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        staTime: '',
        endTime: '',
      },
      () => {
        this.getReward(1);
      }
    );
  };

  handleSearch2 = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // deviceId sellerTel oneTel
      // Should format date value before submit.
      const orderId = fieldsValue['orderId'];
      this.setState(
        {
          orderId: orderId,
        },
        () => {
          this.getDay(1);
        }
      );
    });
  };

  handleClearSearch2 = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        orderId: '',
      },
      () => {
        this.getReward(1);
      }
    );
  };

  details = (text, record) => {
    this.setState(
      {
        date: moment(record.billDay).format('YYYY-MM-DD'),
      },
      () => {
        this.getDay(1);
        this.setState({ activeKey: '2' });
      }
    );
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
  };

  render() {
    let z = this;

    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.ReportForms.order ? this.props.ReportForms.order.list : [];
    const dataSource2 = this.props.ReportForms.day ? this.props.ReportForms.day.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          record.billDay ? (
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              订单详情
            </a>
          ) : (
            ''
          ),
      },
      {
        title: '日期',
        dataIndex: 'billDay',
        key: 'billDay',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD') : '合计'}</span>,
      },
      {
        title: '订单笔数',
        dataIndex: 'orderCount',
        key: 'orderCount',
      },
      {
        title: '订单金额',
        dataIndex: 'rentPriceSum',
        key: 'rentPriceSum',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '租借订单总时长',
        dataIndex: 'continueTimeStr',
        key: 'continueTimeStr',
      },
      {
        title: '微信订单笔数',
        dataIndex: 'wechatCount',
        key: 'wechatCount',
      },
      {
        title: '微信订单金额',
        dataIndex: 'wechatPrice',
        key: 'wechatPrice',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '支付宝订单笔数',
        dataIndex: 'alipayCount',
        key: 'alipayCount',
      },
      {
        title: '支付宝订单金额',
        dataIndex: 'alipayPrice',
        key: 'alipayPrice',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
    ];
    const columns2 = [
      {
        title: '订单编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户手机号码',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '用户类型',
        dataIndex: 'payType',
        key: 'payType',
        render: key => <span>{key === 1 ? '微信' : '支付宝'}</span>,
      },
      {
        title: '代理商名称',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '商家名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '订单起始时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '订单结束时间',
        dataIndex: 'returnTime',
        key: 'returnTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '用户租借时长',
        dataIndex: 'continueTime',
        key: 'continueTime',
      },
      {
        title: '租借费用',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '状态',
        dataIndex: 'orderState',
        key: 'orderState',
        render: key => {
          if (key === '1') {
            return <span>租借中</span>;
          } else if (key === '0') {
            return <span>已结束</span>;
          } else if (key === '-1') {
            return <span>未支付</span>;
          } else if (key === '-2') {
            return <span>订单异常</span>;
          } else if (key === '2') {
            return <span>购买订单</span>;
          } else if (key === '3') {
            return <span>订单废弃</span>;
          }
        },
      },
    ];

    function pageChange(page) {
      z.getReward(page);
    }

    function pageChange2(page) {
      z.getDay(page);
    }

    return (
      <div className={styles.contentWrapper}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <Tabs.TabPane tab="列表页" key="1">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem label="日期">{getFieldDecorator('staTime')(<DatePicker />)}</FormItem>
                  <FormItem>
                    <Input
                      style={{
                        width: 30,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                      }}
                      placeholder="~"
                      disabled
                    />
                  </FormItem>
                  <FormItem>{getFieldDecorator('endTime')(<DatePicker />)}</FormItem>
                  <Button icon="search" type="primary" onClick={this.handleSearch}>
                    搜索
                  </Button>
                  <Button icon="reload" type="primary" onClick={this.handleClearSearch}>
                    重置
                  </Button>
                </Form>
              </Card>
            </div>
            <Table
              bordered
              rowKey="id"
              scroll={{ x: 1000 }}
              loading={this.state.loading}
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
              dataSource={dataSource}
              columns={columns}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="详情页" key="2">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem>
                    {getFieldDecorator('orderId')(<Input placeholder="输入订单号进行查询" />)}
                  </FormItem>
                  <Button icon="search" type="primary" onClick={this.handleSearch2}>
                    搜索
                  </Button>
                  <Button icon="reload" type="primary" onClick={this.handleClearSearch2}>
                    重置
                  </Button>
                </Form>
              </Card>
            </div>
            <Table
              bordered
              className={styles.tableWrapper}
              rowKey="id"
              scroll={{ x: 2000 }}
              loading={this.state.loading}
              pagination={{
                defaultCurrent: 1,
                current: this.state.current2,
                pageSize: this.state.pageSize2,
                total: this.state.total2,
                onChange: pageChange2,
              }}
              dataSource={dataSource2}
              columns={columns2}
            />
            <Row justify="start" type="flex">
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default OrderForm;
