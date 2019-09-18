import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Divider, Tabs } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

@connect(({ withdraw, loading }) => ({
  withdraw,
  loading: loading.models.withdraw,
}))
@Form.create()
class Pass extends Component {
  state = {
    creditCard: '',
    id: '',
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visible: false,
    confirmLoading: false,
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

  getToAudit(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'withdraw/pass',
      payload: {
        condition: {
          state: 1,
          creditCard: this.state.creditCard,
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

  componentDidMount() {
    this.getToAudit(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const creditCard = fieldsValue['creditCard'];
      this.setState(
        {
          creditCard: creditCard,
        },
        () => {
          this.getToAudit(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        creditCard: '',
      },
      () => {
        this.getToAudit(1);
      }
    );
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.withdraw.pass ? this.props.withdraw.pass.list : [];

    const columns = [
      {
        title: '订单号',
        dataIndex: 'withdrawId',
        key: 'withdrawId',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '用户手机号',
        dataIndex: 'userPhone',
        key: 'userPhone',
      },
      {
        title: '提现金额（元）',
        dataIndex: 'money',
        key: 'money',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '手续费（元）',
        dataIndex: 'serviceMoney',
        key: 'serviceMoney',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '到账金额（元）',
        dataIndex: 'realMoney',
        key: 'realMoney',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '开户银行',
        dataIndex: 'bank',
        key: 'bank',
      },
      {
        title: '开户支行',
        dataIndex: 'subBank',
        key: 'subBank',
      },
      {
        title: '开户账号',
        dataIndex: 'bankRealname',
        key: 'bankRealname',
      },
      {
        title: '银行卡号',
        dataIndex: 'creditCard',
        key: 'creditCard',
      },
      {
        title: '预留手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '申请日期',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '处理日期',
        dataIndex: 'handleTime',
        key: 'handleTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function pageChange(page) {
      z.getToAudit(page);
    }

    return (
      <div className={styles.bgc}>
        <Row>
          <Col className={styles.col}>
            <Form className={styles.form}>
              {/*<Form.Item className={styles.form}>*/}
              {/*  {getFieldDecorator('order', {})(*/}
              {/*    <Input placeholder="请输入用户手机号进行搜索" className={styles.input}/>*/}
              {/*  )}*/}
              {/*</Form.Item>*/}
              <Form.Item className={styles.form} label="银行卡号">
                {getFieldDecorator('creditCard', {})(
                  <Input placeholder="请输入银行卡号进行搜索" className={styles.input} />
                )}
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

export default Pass;
