import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Popconfirm, message } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import moment from 'moment';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';

@connect(({ freeze, loading }) => ({
  freeze,
  loading: loading.models.freeze,
}))
@Form.create()
class ApplyFor extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    id: '',
    sellerContact: '',
    oneAgentContact: '',
  };

  getFreeze(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'freeze/applyFor',
      payload: {
        condition: {
          isFreeze: 2,
          id: this.state.id,
          sellerContact: this.state.sellerContact,
          oneAgentContact: this.state.oneAgentContact,
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
    this.getFreeze(1);
  }

  returned = record => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'freeze/returned',
      payload: {
        id: record.id,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getFreeze(z.state.current);
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
      const sellerTel = fieldsValue['sellerTel'];
      const oneTel = fieldsValue['oneTel'];
      this.setState(
        {
          id: deviceId,
          sellerContact: sellerTel,
          oneAgentContact: oneTel,
        },
        () => {
          this.getFreeze(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        id: '',
        sellerContact: '',
        oneAgentContact: '',
      },
      () => {
        this.getFreeze(1);
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
    const dataSource = this.props.freeze.applyFor ? this.props.freeze.applyFor.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'left',
        render: (text, record) => (
          <Popconfirm title="是否进行回款操作？" onConfirm={() => this.returned(record)}>
            <a href="javascript:;">确认回款</a>
          </Popconfirm>
        ),
      },
      {
        title: '设备编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '设备状态',
        dataIndex: 'state',
        key: 'state',
        render: key => <span>{key === -2 ? '已遗失' : '未遗失'}</span>,
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        render: key => <span>{key + '口' + (key - 1) + '台'}</span>,
      },
      {
        title: '回款金额',
        dataIndex: 'unfreezeMoney',
        key: 'unfreezeMoney',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '持有商户',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '商户联系人',
        dataIndex: 'sellerContactMan',
        key: 'sellerContactMan',
      },
      {
        title: '商户联系方式',
        dataIndex: 'sellerContact',
        key: 'sellerContact',
      },
      {
        title: '设备地址',
        dataIndex: 'boxAddress',
        key: 'boxAddress',
      },
      {
        title: '总代理',
        dataIndex: 'oneAgentName',
        key: 'oneAgentName',
      },
      {
        title: '总代理联系方式',
        dataIndex: 'oneAgentContact',
        key: 'oneAgentContact',
      },
      {
        title: '总代理开户行',
        dataIndex: 'oneAgentBank',
        key: 'oneAgentBank',
      },
      {
        title: '总代理银行卡号',
        dataIndex: 'oneAgentCreditCard',
        key: 'oneAgentCreditCard',
      },
      {
        title: '总代理持卡人',
        dataIndex: 'oneAgentCardUserName',
        key: 'oneAgentCardUserName',
      },
      {
        title: '总代理预留手机号',
        dataIndex: 'oneAgentCardPhone',
        key: 'oneAgentCardPhone',
      },
      {
        title: '解冻时间',
        dataIndex: 'freezeTime',
        key: 'freezeTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function pageChange(page) {
      z.getFreeze(page);
    }

    return (
      <div>
        <Row className={styles.bgc}>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form} label="设备编号">
                {getFieldDecorator('deviceId', {})(
                  <Input placeholder="请输入设备编号进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="商户联系方式">
                {getFieldDecorator('sellerTel', {})(
                  <Input placeholder="请输入商户联系方式进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="总代理联系方式">
                {getFieldDecorator('oneTel', {})(
                  <Input placeholder="请输入总代理联系方式进行搜索" className={styles.input} />
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

export default ApplyFor;
