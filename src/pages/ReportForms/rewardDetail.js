import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Popconfirm, message, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ ReportForms, loading }) => ({
  ReportForms,
  loading: loading.models.ReportForms,
}))
@Form.create()
class RewardDetail extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    level: '',
    type: '',
    phone: '',
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
      type: 'ReportForms/reward',
      payload: {
        condition: {
          level: this.state.level,
          type: this.state.type,
          phone: this.state.phone,
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
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
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
      const level = fieldsValue['level'];
      const type = fieldsValue['type'];
      const phone = fieldsValue['phone'];
      const orderId = fieldsValue['orderId'];
      this.setState(
        {
          level: level,
          type: type,
          phone: phone,
          orderId: orderId,
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
        level: '',
        type: '',
        phone: '',
        orderId: '',
      },
      () => {
        this.getReward(1);
      }
    );
  };

  render() {
    let z = this;

    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.ReportForms.reward ? this.props.ReportForms.reward.list : [];

    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: key => {
          if (key === 0) {
            return <span>代理</span>;
          } else {
            return <span>商户</span>;
          }
        },
      },
      {
        title: '等级',
        dataIndex: 'level',
        key: 'level',
        render: key => {
          if (key === 1) {
            return <span>总代理</span>;
          } else if (key === 2) {
            return <span>一级代理</span>;
          } else if (key === 3) {
            return <span>二级代理</span>;
          } else if (key === 4) {
            return <span>三级代理</span>;
          }
        },
      },
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '企业名称',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '联系人',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '上级代理',
        dataIndex: 'parentAgent',
        key: 'parentAgent',
      },
      {
        title: '上级代理联系方式',
        dataIndex: 'parentAgentContact',
        key: 'parentAgentContact',
      },
      {
        title: '分润比例',
        dataIndex: 'rewardRate',
        key: 'rewardRate',
        render: key => <span>{key * 100 + '%'}</span>,
      },
      {
        title: '订单编号',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '订单金额（元）',
        dataIndex: 'realPayment',
        key: 'realPayment',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '分润金额（元）',
        dataIndex: 'reward',
        key: 'reward',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '订单支付时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function pageChange(page) {
      z.getReward(page);
    }

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="代理等级">
                {getFieldDecorator('level', { initialValue: '0' })(
                  <Select style={{ width: 150 }}>
                    <Option value="1">总代理</Option>
                    <Option value="2">1级代理</Option>
                    <Option value="3">2级代理</Option>
                    <Option value="4">3级代理</Option>
                    <Option value="0">全部</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="类型">
                {getFieldDecorator('type', { initialValue: '-1' })(
                  <Select style={{ width: 150 }}>
                    <Option value="0">代理商</Option>
                    <Option value="1">商户</Option>
                    <Option value="-1">全部</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="联系方式">
                {getFieldDecorator('phone')(<Input style={{ width: 150 }} />)}
              </FormItem>
              <FormItem label="订单编号">
                {getFieldDecorator('orderId')(<Input style={{ width: 150 }} />)}
              </FormItem>
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
          rowKey="unique"
          scroll={{ x: 1400 }}
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
      </div>
    );
  }
}

export default RewardDetail;
