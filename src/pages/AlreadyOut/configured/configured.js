import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, Tabs, message } from 'antd';
import styles from '@/pages/mylayout.less';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Details from './detail';
import { connect } from 'dva';
import moment from 'moment';
import ReplaceModal from '@/pages/AlreadyOut/configured/modals/replace';
import { editConfigured, replace } from '@/services/alreadyOut';
import EditModal from '@/pages/AlreadyOut/configured/modals/edit';
import { typeFormatter } from '@/utils/handleNumber';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@connect(({ alreadyOut, loading }) => ({
  alreadyOut,
  loading: loading.models.alreadyOut,
}))
@Form.create()
class Configured extends Component {
  state = {
    payload: {
      condition: {
        deviceId: '',
        sellerPhone: '',
        agentPhone: '',
        staHour: '',
        endHour: '',
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
    //  新增
    addVisible: false,
    editVisible: false,
    //  编辑信息
    editData: {},
    //   统计数据
    totalInfo: {},
    //   tab
    activeKey: '1',
    // 详情信息
    info: {},
    sort: 'ascend',
    recallVisible: false,
    recallData: {},
  };
  // 初始化列表
  initialData = type => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'alreadyOut/getConfiguredList',
      payload: {
        condition: {
          deviceId: '',
          sellerPhone: '',
          agentPhone: '',
          staHour: '',
          endHour: '',
        },
        desc: true,
        nowPage: type === 'afterAdd' ? 1 : current,
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
          selectedRowKeys: [],
          editData: {},
          info: {},
          recallData: {},
        });
      },
    });
  };
  componentDidMount() {
    this.initialData();
    const { dispatch } = this.props;
    dispatch({
      type: 'alreadyOut/getTotal',
      callback: res =>
        this.setState({
          totalInfo: { ...res },
        }),
    });
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
        // 累计金额排序
        if (sorter.order) {
          payload.orderCondition = ['rentPriceSum'];
          if (sorter.order === 'ascend') {
            payload.desc = false;
          } else if (sorter.order === 'descend') {
            payload.desc = true;
          }
        } else {
          payload.orderCondition = ['id'];
          payload.desc = true;
        }
        dispatch({
          type: 'alreadyOut/getConfiguredList',
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
      ['deviceId', 'sellerPhone', 'agentPhone', 'staHour', 'endHour'],
      (errors, values) => {
        if (!errors) {
          payload.condition = { ...values };
          payload.nowPage = 1;
          dispatch({
            type: 'alreadyOut/getConfiguredList',
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
            deviceId: '',
            sellerPhone: '',
            agentPhone: '',
            staHour: '',
            endHour: '',
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
  // 点击详情
  handleGetDetails = id => {
    const { dispatch } = this.props;
    this.setState({
      activeKey: '2',
    });
    dispatch({
      type: 'alreadyOut/getDetails',
      payload: id,
      callback: res => {
        this.setState({
          info: res,
        });
      },
    });
  };
  // 点击tabs
  handleClickTab = key => {
    this.setState({
      activeKey: key,
      // info: {},
    });
  };
  // 点击详情页返回按钮
  clickReturnBtn = () => {
    this.setState({
      activeKey: '1',
      info: '',
    });
  };
  // 替换
  onClickRecall = id => {
    this.setState({
      recallData: { id },
      recallVisible: true,
    });
  };
  // 替换确认
  handleRecallOk = values => {
    this.setState({
      recallVisible: false,
    });
    const {
      recallData: { id },
    } = this.state;
    replace({ ...values, oldDeviceId: id }).then(res => {
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
  // 编辑
  onClickEdit = record => {
    this.setState({
      editData: { ...record },
      editVisible: true,
    });
  };
  // 替换确认
  handleEditOk = values => {
    const {
      editData: { deviceId },
    } = this.state;
    editConfigured({ ...values, boxId: deviceId }).then(res => {
      if (res.code === '000000') {
        message.success('操作成功');
        this.setState({
          editVisible: false,
        });
        this.initialData();
      } else message.error('操作失败:' + res.msg, 6);
    });
  };
  handleEditCancel = () => {
    this.setState({
      editVisible: false,
      editData: {},
    });
    1;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const pager = this.state.pagination;
    const {
      totalInfo: { installedCount, offLineCount, onlineCount },
    } = this.state;
    const pagination = {
      showTotal: () => {
        return (
          <div className={selfStyle.total}>
            <p>离线设备总量：{offLineCount}</p>
            <p>在线设备总量：{onlineCount}</p>
            <p>已部署设备总量：{installedCount}</p>
          </div>
        );
      },
      ...pager,
    };
    const { list } = this.props.alreadyOut.configuredList;
    const columns = [
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <>
              <a href="javascript:;" onClick={() => this.onClickEdit(record)}>
                编辑
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.onClickRecall(record.deviceId)}>
                替换
              </a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.handleGetDetails(record.deviceId)}>
                详情
              </a>
            </>
          );
        },
        width: 200,
        fixed: 'left',
      },
      { title: '设备编号', dataIndex: 'deviceId', width: 100 },
      {
        title: '运行状态',
        dataIndex: 'deviceState',
        width: 100,
        render: text => (text == -1 ? '故障' : text == 0 ? '离线' : '在线'),
      },
      { title: '持续离线时长', dataIndex: 'offLineTime', width: 140 },
      {
        title: '冻结状态',
        dataIndex: 'isFreeze',
        width: 100,
        render: text => {
          switch (text) {
            case 0:
              return '未冻结';
            case 1:
              return '冻结';
            case 2:
              return '已解冻';
            case 3:
              return '已回款';
            default:
              return '';
          }
        },
      },
      { title: '详细地址', dataIndex: 'boxAddress', width: 220 },
      {
        title: '设备单价',
        dataIndex: 'details',
        width: 100,
        render: text => (text / 100).toFixed(2),
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: 100,
        render: text => typeFormatter(text),
      },
      { title: '商户名称', dataIndex: 'sellerName', width: 160 },
      { title: '商户联系人', dataIndex: 'sellerLinkName', width: 120 },
      { title: '联系方式', dataIndex: 'sellerLinkTel', width: 100 },
      { title: '批次', dataIndex: 'batchName', width: 100 },
      { title: '充电宝数量', dataIndex: 'deviceNum', width: 120 },
      {
        title: '累计订单量',
        dataIndex: 'orderNum',
        width: 140,
      },
      {
        title: '累计订单金额（元）',
        dataIndex: 'rentPriceSum',
        width: 190,
        render: text => (text / 100).toFixed(2),
        sorter: true,
      },
      {
        title: '昨日订单金额（元）',
        dataIndex: 'yesterdayMoneySum',
        width: 170,
        render: text => (text / 100).toFixed(2),
      },
      { title: '昨日订单量', dataIndex: 'yesterdayCount', width: 120 },
      {
        title: '冻结金额',
        dataIndex: 'freezeMoney',
        width: 100,
        render: text => (text / 100).toFixed(2),
      },
      {
        title: '已解冻金额',
        dataIndex: 'unfreezeMoney',
        width: 120,
        render: text => (text / 100).toFixed(2),
      },
      { title: '总代理', dataIndex: 'oneAgentName', width: 100 },
      { title: '总代理联系方式', dataIndex: 'oneAgentLinkTel', width: 140 },
      {
        title: '安装日期',
        dataIndex: 'createTime',
        render: text => moment(text).format('YYYY/MM/DD HH:mm:ss'),
      },
    ];
    return (
      <div className={styles.contentWrapper}>
        <Tabs activeKey={this.state.activeKey} onChange={key => this.handleClickTab(key)}>
          <TabPane tab="列表页" key="1">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem label="设备编号">
                    {getFieldDecorator('deviceId')(<Input style={{ width: '150px' }} />)}
                  </FormItem>
                  <FormItem label="商户联系方式">
                    {getFieldDecorator('sellerPhone')(<Input style={{ width: '150px' }} />)}
                  </FormItem>
                  <FormItem label="总代理联系方式">
                    {getFieldDecorator('agentPhone')(<Input style={{ width: '150px' }} />)}
                  </FormItem>
                  <FormItem label="持续离线">
                    {getFieldDecorator('staHour')(
                      <Input style={{ width: '100px' }} suffix="小时" />
                    )}
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
                    {getFieldDecorator('endHour')(
                      <Input style={{ width: '100px' }} suffix="小时" />
                    )}
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
              scroll={{ x: 3000 }}
              pagination={pagination}
              onChange={this.handleTableChange}
              loading={this.props.loading}
            />
          </TabPane>
          <TabPane tab="详情页" key="2">
            <Details info={this.state.info} clickReturnBtn={this.clickReturnBtn} />
          </TabPane>
        </Tabs>
        <ReplaceModal
          onOk={this.handleRecallOk}
          onCancel={this.handleRecallCancel}
          visible={this.state.recallVisible}
          recallData={this.state.recallData}
        />
        <EditModal
          onOk={this.handleEditOk}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
          editData={this.state.editData}
        />
      </div>
    );
  }
}

export default Configured;
