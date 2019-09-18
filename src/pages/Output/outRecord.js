import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import moment from 'moment';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { typeFormatter } from '@/utils/handleNumber';

const FormItem = Form.Item;

const columns = [
  { title: '出库编号', dataIndex: 'exportId' },
  { title: '快递单号', dataIndex: 'expressNo' },
  { title: '设备编号', dataIndex: 'deviceId' },
  { title: '设备类型', dataIndex: 'deviceType', render: text => typeFormatter(text) },
  { title: '批次', dataIndex: 'batchName' },
  {
    title: '入库日期',
    dataIndex: 'importTime',
    render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : null),
  },
  {
    title: '出库日期',
    dataIndex: 'exportTime',
    render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : null),
  },
  { title: '领用人', dataIndex: 'reciver' },
  { title: '领用人联系方式', dataIndex: 'reciverContact' },
];
@connect(({ outPut, loading }) => ({
  outPut,
  loading: loading.models.outPut,
}))
@Form.create()
class OutManage extends Component {
  state = {
    payload: {
      condition: {
        reciverContact: '',
        deviceId: '',
        exportId: '',
        startExportTime: '',
        endExportTime: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: ['exportId'],
      pageSize: 10,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    exportId: '',
  };
  // 初始化列表
  initialData = () => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
      exportId,
    } = this.state;
    dispatch({
      type: 'outPut/getOutRecord',
      payload: {
        condition: {
          reciverContact: '',
          deviceId: '',
          exportId: exportId ? exportId : '',
          startExportTime: '',
          endExportTime: '',
        },
        desc: true,
        nowPage: current,
        orderCondition: ['exportId'],
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
  static getDerivedStateFromProps(nextProps, prevState) {
    const { exportId } = nextProps.outPut;
    // type可能由props驱动，也可能由state驱动，这样判断会导致state驱动的type被回滚
    return {
      exportId,
    };
    // 否则，对于state不进行任何操作
  }

  componentDidUpdate(prevProps) {
    if (prevProps.outPut.exportId) {
      this.initialData(this.props.outPut.exportId);
      const { dispatch } = this.props;
      this.setState({
        condition: {
          exportId: prevProps.outPut.exportId,
        },
      });
      dispatch({
        type: 'outPut/clearExportId',
      });
    }
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
          type: 'outPut/getOutRecord',
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
    validateFields(
      ['reciverContact', 'deviceId', 'exportId', 'startExportTime', 'endExportTime'],
      (errors, values) => {
        if (values.startExportTime)
          values.startExportTime = moment(values.startExportTime).format('YYYY-MM-DD HH:mm:ss');
        if (values.endExportTime)
          values.endExportTime = moment(values.endExportTime).format('YYYY-MM-DD HH:mm:ss');
        if (!errors) {
          payload.condition = { ...values };
          payload.nowPage = 1;
          dispatch({
            type: 'outPut/getOutRecord',
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
      }
    );
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
          orderCondition: ['exportId'],
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
    const { list } = this.props.outPut.outRecordList;
    const { pagination } = this.state;
    const { exportId } = this.props.outPut;
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
                {getFieldDecorator('reciverContact', {
                  rules: [
                    {
                      validator: this.mobileValidator,
                    },
                  ],
                })(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="设备编号">
                {getFieldDecorator('deviceId')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="出库编号">
                {getFieldDecorator('exportId', {
                  initialValue: exportId ? exportId : null,
                })(<Input style={{ width: '170px' }} />)}
              </FormItem>
              <FormItem label="出库日期">
                {getFieldDecorator('startExportTime', {
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
                {getFieldDecorator('endExportTime', {
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
          rowKey="unique"
          loading={this.props.loading}
          pagination={pager}
          onChange={this.handleTableChange}
          scroll={{ x: 1200 }}
        />
      </div>
    );
  }
}

export default OutManage;
