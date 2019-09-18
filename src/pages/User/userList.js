import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Popconfirm, message } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
const FormItem = Form.Item;
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class UserList extends Component {
  state = {
    payload: {
      condition: {
        userType: '',
        userState: '',
        mobile: '',
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
  componentDidMount() {
    this.initialDispatch();
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
          type: 'userManage/getUserList',
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
    validateFields(['userType', 'userState', 'mobile'], (errors, values) => {
      payload.condition = { ...values };
      payload.nowPage = 1;
      dispatch({
        type: 'userManage/getUserList',
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
  initialDispatch = () => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'userManage/getUserList',
      payload: {
        condition: {
          userType: '',
          userState: '',
          mobile: '',
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
  //重置
  handleClearSearch = () => {
    this.props.form.resetFields();
    const { dispatch } = this.props;
    this.setState(
      {
        payload: {
          condition: {
            userType: '',
            userState: '',
            mobile: '',
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
      () => this.initialDispatch()
    );
  };
  // 禁用
  handleForbidden = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/forbidden',
      payload: {
        userId: record.id,
        status: record.roleids === '1' ? 1 : 0,
      },
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('操作成功');
          dispatch({
            type: 'userManage/getUserList',
            payload: this.state.payload,
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
        } else message.error('操作失败:' + res.msg);
      },
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const { list } = this.props.userManage.userList;
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
    const columns = [
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => {
          return record.roleids === '0' || record.roleids === '' ? (
            <Popconfirm title="确定要禁用吗?" onConfirm={() => this.handleForbidden(record)}>
              <a href="javascript:">禁用</a>
            </Popconfirm>
          ) : record.roleids === '1' ? (
            <Popconfirm title="确定要启用吗?" onConfirm={() => this.handleForbidden(record)}>
              <a href="javascript:">启用</a>
            </Popconfirm>
          ) : null;
        },
      },
      {
        title: '用户编号',
        dataIndex: 'id',
      },
      {
        title: '用户类型',
        dataIndex: 'dentis',
        render: (text, record, index) => {
          return text == 1 ? '微信' : '支付宝';
        },
      },
      {
        title: '状态',
        dataIndex: 'roleids',
        render: (text, record, index) => {
          return text == 0 ? '正常' : '禁用';
        },
      },
      { title: '联系方式', dataIndex: 'mobile' },
      { title: '租借总次数', dataIndex: 'rentTimeCount' },
      { title: '超时租借次数', dataIndex: 'outTimeCount' },
      {
        title: '实付总金额（元）',
        dataIndex: 'realPaySum',
        render: text => (text / 100).toFixed(2),
      },
      {
        title: '注册时间',
        dataIndex: 'regTime',
        render: (text, record, index) => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '无'),
      },
    ];
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="用户类型">
                {getFieldDecorator('userType')(
                  <Select style={{ width: '150px' }}>
                    <Option value={1}>微信</Option>
                    <Option value={2}>支付宝</Option>
                    <Option value={''}>全部</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="用户状态">
                {getFieldDecorator('userState')(
                  <Select style={{ width: '150px' }}>
                    <Option value={0}>正常</Option>
                    <Option value={1}>禁用</Option>
                    <Option value={''}>全部</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="联系方式">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      validator: this.mobileValidator,
                    },
                  ],
                })(<Input style={{ width: '150px' }} />)}
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
          onChange={this.handleTableChange}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

export default UserList;
