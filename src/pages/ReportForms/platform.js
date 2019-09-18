import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Popconfirm, message, DatePicker } from 'antd';
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
class Platform extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
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
      type: 'ReportForms/distribution',
      payload: {
        condition: {
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
      const orderId = fieldsValue['orderId'];
      this.setState(
        {
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
    const dataSource = this.props.ReportForms.distribution
      ? this.props.ReportForms.distribution.list
      : [];
    const columns = [
      {
        title: '平台分润（元）',
        dataIndex: 'platformReward',
        key: 'platformReward',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '分润比例',
        dataIndex: 'platformRewardRate',
        key: 'platformRewardRate',
        render: key => <span>{key ? key * 100 + '%' : '0.00%'}</span>,
      },
      {
        title: '订单编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '订单金额（元）',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '订单支付时间',
        dataIndex: 'updTime',
        key: 'updTime',
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
      </div>
    );
  }
}

export default Platform;
