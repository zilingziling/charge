import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
const FormItem = Form.Item;
const { Column } = Table;
const columns = [
  { title: '用户类型', dataIndex: 'userType' },
  { title: '联系方式', dataIndex: 'contactMobile' },
  { title: '开户行', dataIndex: 'bank' },
  { title: '银行卡号', dataIndex: 'creditCard' },
  { title: '持卡人', dataIndex: 'realName' },
  { title: '预留手机号', dataIndex: 'mobile' },
];
@connect(({ loading, userManage }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class BankCards extends Component {
  state = {
    payload: {
      condition: {
        userType: '',
        contactMobile: '',
        realName: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: [],
      pageSize: 10,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: '',
    },
  };
  // 初始化列表
  initialData = () => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'userManage/getBankCardList',
      payload: {
        condition: {
          userType: '',
          contactMobile: '',
          realName: '',
        },
        desc: true,
        nowPage: current,
        orderCondition: [],
        pageSize: 10,
      },
      callback: res => {
        this.setState({
          pagination: {
            current: res.pageIndex,
            pageSize: res.pageSize,
            total: res.total,
          },
        });
      },
    });
  };
  componentDidMount() {
    this.initialData();
  }
  // 分页查询
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        payload: {
          ...this.state.payload,
          nowPage: pagination.current,
        },
      },
      () => {
        const { payload } = this.state;
        const { dispatch } = this.props;
        dispatch({
          type: 'userManage/getBankCardList',
          payload: payload,
          callback: res => {
            this.setState({
              pagination: {
                current: res.pageIndex,
                pageSize: res.pageSize,
                total: res.total,
              },
            });
          },
        });
      }
    );
  };
  // 点击搜索
  handleSearch = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    const { payload } = this.state;
    validateFields(['userType', 'contactMobile', 'realName'], (errors, values) => {
      payload.condition = { ...values };
      payload.nowPage = 1;
      dispatch({
        type: 'userManage/getBankCardList',
        payload,
        callback: res => {
          //查询时的分页
          this.setState({
            pagination: {
              current: res.pageIndex,
              pageSize: res.pageSize,
              total: res.total,
            },
          });
        },
      });
      this.setState({
        payload: {
          condition: { ...values },
        },
      });
    });
  };
  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    if (value) {
      const reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码!');
      }
    }
    callback();
  };
  //重置
  handleClearSearch = () => {
    this.props.form.resetFields();
    const { dispatch } = this.props;
    this.setState(
      {
        payload: {
          condition: {
            userType: '',
            contactMobile: '',
            realName: '',
          },
          desc: true,
          nowPage: 1,
          orderCondition: [],
          pageSize: 10,
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: '',
        },
      },
      () => this.initialData()
    );
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const { list } = this.props.userManage.bankCardList;
    const { pagination } = this.state;
    const pager = {
      ...pagination,
      showTotal: () => {
        return (
          <div className={selfStyle.total}>
            <p>共计：{this.state.pagination.total} 条</p>
          </div>
        );
      },
    };
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="用户类型">
                {getFieldDecorator('userType')(
                  <Select style={{ width: '150px' }}>
                    <Option value={2}>代理商</Option>
                    <Option value={1}>商户</Option>
                    <Option value={0}>全部</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="联系方式">
                {getFieldDecorator('contactMobile', {
                  rules: [
                    {
                      validator: this.mobileValidator,
                    },
                  ],
                })(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="持卡人">
                {getFieldDecorator('realName')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <Button icon="search" type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
              <Button type="danger" onClick={this.handleClearSearch}>
                重置
              </Button>
            </Form>
          </Card>
        </div>
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          pagination={pager}
          loading={this.props.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default BankCards;
