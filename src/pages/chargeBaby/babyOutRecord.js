import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import moment from 'moment';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;

const columns = [
  { title: '快递单号', dataIndex: 'expressNo' },
  { title: '出库类型', dataIndex: 'exportType' },
  { title: '小宝编号', dataIndex: 'terminalId' },
  { title: '批次', dataIndex: 'batchName' },
  {
    title: '入库日期',
    dataIndex: 'createTime',

    render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : ''),
  },
  {
    title: '出库日期',
    dataIndex: 'updateTime',

    render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : ''),
  },
  { title: '领用人', dataIndex: 'agentName' },
  { title: '领用人联系方式', dataIndex: 'agentPhone' },
];
@connect(({ chargeBaby, loading }) => ({
  chargeBaby,
  loading: loading.models.chargeBaby,
}))
@Form.create()
class OutBabyRecord extends Component {
  state = {
    payload: {
      condition: {
        phone: '',
        terminalId: '',
        expressNo: '',
        staTime: '',
        endTime: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: [''],
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
      type: 'chargeBaby/getOutBabyRecordList',
      payload: {
        condition: {
          phone: '',
          terminalId: '',
          expressNo: '',
          staTime: '',
          endTime: '',
        },
        desc: true,
        nowPage: current,
        orderCondition: [''],
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
  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    if (value) {
      const reg = /^1[3|4|5|6|7|8|9|0|2|1][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码!');
      }
    }
    callback();
  };
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
          type: 'chargeBaby/getOutBabyRecordList',
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
    validateFields(['phone', 'terminalId', 'expressNo', 'staTime', 'endTime'], (errors, values) => {
      if (values.staTime) values.staTime = moment(values.staTime).format('YYYY-MM-DD HH:mm:ss');
      if (values.endTime) values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss');
      if (!errors) {
        payload.condition = { ...values };
        payload.nowPage = 1;
        dispatch({
          type: 'chargeBaby/getOutBabyRecordList',
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
      }
    });
  };
  //重置
  handleClearSearch = () => {
    this.props.form.resetFields();
    this.setState(
      {
        payload: {
          condition: {
            agentPhone: '',
            staTime: '',
            endTime: '',
          },
          desc: true,
          nowPage: 1,
          orderCondition: [''],
          pageSize: 10,
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: '',
        },
      },
      () => {
        this.initialData();
      }
    );
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props.chargeBaby.outBabyRecordList;
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
              <FormItem label="领用人联系方式">
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      validator: this.mobileValidator,
                    },
                  ],
                })(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="小宝编号">
                {getFieldDecorator('terminalId')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="快递单号">
                {getFieldDecorator('expressNo')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="出库日期">
                {getFieldDecorator('staTime', {
                  initialValue: null,
                })(<DatePicker showTime />)}
              </FormItem>
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
              <FormItem>
                {getFieldDecorator('endTime', {
                  initialValue: null,
                })(<DatePicker showTime />)}
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
          dataSource={list}
          columns={columns}
          rowKey="terminalId"
          loading={this.props.loading}
          pagination={pager}
          onChange={this.handleTableChange}
          scroll={{ x: 1300 }}
        />
      </div>
    );
  }
}

export default OutBabyRecord;
