import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Modal, message, Radio } from 'antd';
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
class ToAudit extends Component {
  state = {
    creditCard: '',
    id: '',
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visible: false,
    confirmLoading: false,
    radio: 1,
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
      type: 'withdraw/toAudit',
      payload: {
        condition: {
          state: 0,
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

  audit(state, result) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'withdraw/audit',
      payload: { id: this.state.id, state: state, result: result },
      callback: function(res) {
        z.setState({
          visible: false,
          confirmLoading: false,
        });
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getToAudit(1);
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
        },
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
      },
    );
  };

  showModal = (text, record) => {
    this.setState(
      {
        visible: true,
        id: record.withdrawId,
        radio: 1,
      },
      () => {
        this.props.form.setFieldsValue({
          'radio-group': 1,
        });
        if (this.props.form.result) {
          this.props.form.setFieldsValue({
            result: '',
          });
        }
      },
    );
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const result = value['result'];
      const state = value['radio-group'];
      this.audit(state, result);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onRadioChange = e => {
    this.setState({
      radio: e.target.value,
    });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.withdraw.toAudit ? this.props.withdraw.toAudit.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              className={styles.red}
              onClick={() => this.showModal(text, record)}
            >
              审核
            </a>
          </span>
        ),
      },
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
                  <Input placeholder="请输入银行卡号进行搜索" className={styles.input}/>,
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
        <Modal
          title="提现审核"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          className={styles.modal}
        >
          <Form>
            <Form.Item label="审核情况">
              {getFieldDecorator('radio-group')(
                <Radio.Group onChange={this.onRadioChange}>
                  <Radio value={1}>审核通过</Radio>
                  <Radio value={-1}>审核不通过</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            {this.state.radio === -1 ? (
              <Form.Item label="原因">
                {getFieldDecorator('result', {})(<Input.TextArea rows={4}/>)}
              </Form.Item>
            ) : (
              ''
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ToAudit;
