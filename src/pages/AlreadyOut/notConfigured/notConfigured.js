import React, { useState, Component } from 'react';
import {
  Form,
  Table,
  Input,
  Select,
  Button,
  Divider,
  DatePicker,
  Card,
  Modal,
  message,
} from 'antd';
import styles from '@/pages/mylayout.less';
import selfStyle from './relation.less';
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import { connect } from 'dva/index';
import AgentRelationship from '@/pages/AlreadyOut/notConfigured/agentRelation';
import RecallModal from '@/pages/AlreadyOut/notConfigured/modals/recall';
import { recall } from '@/services/alreadyOut';
import { typeFormatter } from '@/utils/handleNumber';

@connect(({ alreadyOut, loading }) => ({
  alreadyOut,
  loading: loading.models.alreadyOut,
}))
@Form.create()
class notConfigured extends Component {
  state = {
    payload: {
      condition: {
        oneAgentPhone: '',
        deviceId: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: ['id'],
      pageSize: 10,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    //  代理关系
    info: {},
    relationVisible: false,
    recallVisible: false,
    recallData: {},
  };
  // 初始化列表
  initialData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alreadyOut/getNotConfiguredList',
      payload: {
        condition: {
          oneAgentPhone: '',
          deviceId: '',
        },
        desc: true,
        nowPage: 1,
        orderCondition: ['id'],
        pageSize: 10,
      },
      callback: res => {
        this.setState({
          pagination: {
            current: res.pageIndex,
            pageSize: res.pageSize,
            total: res.total,
          },
          recallData: {},
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
          type: 'alreadyOut/getNotConfiguredList',
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
    validateFields(['oneAgentPhone', 'deviceId'], (errors, values) => {
      if (!errors) {
        payload.condition = { ...values };
        payload.nowPage = 1;
        dispatch({
          type: 'alreadyOut/getNotConfiguredList',
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
            oneAgentPhone: '',
            deviceId: '',
          },
          desc: true,
          nowPage: 1,
          orderCondition: ['id'],
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
  // 点击代理关系
  handleAgentRelation = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alreadyOut/getAgentRelations',
      payload: id,
      callback: res => {
        this.setState(
          {
            info: res,
          },
          () => {
            Modal.info({
              title: '代理关系',
              content: <AgentRelationship info={this.state.info} />,
              onOk: () => {
                this.setState({
                  info: {},
                });
              },
              width: 800,
            });
          }
        );
      },
    });
  };
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
  // 撤回
  onClickRecall = id => {
    this.setState({
      recallData: { id },
      recallVisible: true,
    });
  };
  // 撤回确认
  handleRecallOk = values => {
    this.setState({
      recallVisible: false,
    });
    const {
      recallData: { id },
    } = this.state;
    const { dispatch } = this.props;
    recall({ ...values, id }).then(res => {
      if (res.code === '000000') {
        message.success('操作成功');
        this.initialData();
      } else message.error('操作失败:' + res.msg, 6);
    });
  };
  handleRecallCancel = () => {
    this.setState({
      recallVisible: false,
      recallData: {},
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const rowSelection = {};
    const { list } = this.props.alreadyOut.notConfiguredList;
    const pagination = this.state.pagination;
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
        dataIndex: 'operate',
        fixed: 'left',
        key: 'operate',
        render: (text, record) => {
          return (
            <>
              <a href="javascript:;" onClick={() => this.handleAgentRelation(record.deviceId)}>
                代理关系
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.onClickRecall(record.deviceId)}>
                撤回
              </a>
            </>
          );
        },
        width: 180,
      },
      { title: '设备编号', dataIndex: 'deviceId', width: 100 },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: 100,
        render: text => typeFormatter(text),
      },
      {
        title: '出库时间',
        dataIndex: 'exportTime',
        width: 170,
        render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '无'),
      },
      {
        title: '总代理',
        dataIndex: 'oneAgentName',
        width: 120,
        render: (text, record) => (record.belongAgentLevel === 1 ? record.belongAgentName : text),
      },
      {
        title: '总代理联系方式',
        dataIndex: 'oneAgentPhone',
        width: 150,
        render: (text, record) => (record.belongAgentLevel === 1 ? record.belongAgentPhone : text),
      },
      {
        title: '所属代理等级',
        dataIndex: 'belongAgentLevel',
        width: 150,
        render: (text, record) =>
          text === 0
            ? '平台直属'
            : text === 1
            ? '总代理'
            : text === 2
            ? '1级代理'
            : text === 3
            ? '2级代理'
            : text === 4
            ? '3级代理'
            : '未知',
      },
      { title: '所属代理名称', dataIndex: 'belongAgentName', width: 150 },
      { title: '所属代理联系方式', dataIndex: 'belongAgentPhone', width: 180 },
      {
        title: '领取时间',
        dataIndex: 'assginTime',
        width: 170,
        render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '无'),
      },
      { title: '滞留时间（分）', dataIndex: 'stayTime' },
    ];

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="总代理联系方式">
                {getFieldDecorator('oneAgentPhone', {
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
          rowKey="deviceId"
          onChange={this.handleTableChange}
          pagination={pager}
          loading={this.props.loading}
          scroll={{ x: 1500 }}
        />
        <RecallModal
          onOk={this.handleRecallOk}
          onCancel={this.handleRecallCancel}
          visible={this.state.recallVisible}
          recallData={this.state.recallData}
        />
      </div>
    );
  }
}

export default notConfigured;
