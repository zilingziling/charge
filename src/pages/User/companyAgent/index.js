import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, Tabs, message, Popconfirm } from 'antd';
import styles from '@/pages/mylayout.less';
import Details from '@/pages/User/personalAgent/details';
import moment from 'moment';
import { connect } from 'dva';
import EditModal from '@/pages/User/personalAgent/modals/editModal';
import AssociateModal from '@/pages/User/personalAgent/modals/associateModal';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { idSlice } from '@/utils/handleNumber';
import CompanyModal from '@/pages/User/companyAgent/modals/companyModal';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class Index extends Component {
  state = {
    payload: {
      condition: {
        userType: 1,
        level: '',
        state: '',
        userState: '',
        phone: '',
        parentPhone: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: ['orderPriceSum'],
      pageSize: 10,
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    //  新增
    addVisible: false,
    //   点击编辑
    editInfo: {},
    editVisible: false,
    editId: '',
    //  详情
    info: {},
    activeKey: '1',
    //  批量删除
    selectedRowKeys: [],
    //  关联
    associateVisible: false,
    associateInfo: {},
    associateId: '',
  };
  initialData = type => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'userManage/companyAgent',
      payload: {
        condition: {
          userType: 1,
          level: '',
          state: '',
          userState: '',
          phone: '',
          parentPhone: '',
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
          editInfo: {},
          editId: '',
          info: {},
          associateInfo: {},
          associateId: '',
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
          type: 'userManage/companyAgent',
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
    validateFields(['level', 'state', 'userState', 'phone', 'parentPhone'], (errors, values) => {
      if (!errors) {
        payload.condition = { ...values, userType: 1 };
        payload.nowPage = 1;
        dispatch({
          type: 'userManage/companyAgent',
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
            condition: { ...values, ...this.state.payload.condition },
          },
        });
      }
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
    this.setState(
      {
        payload: {
          condition: {
            userType: 1,
            level: '',
            state: '',
            userState: '',
            phone: '',
            parentPhone: '',
          },
          desc: true,
          nowPage: 1,
          orderCondition: ['orderPriceSum'],
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
  // 新增
  handleAddPersonalAgent = () => {
    this.setState({
      addVisible: true,
    });
  };
  // 新增确认
  handleAddOk = values => {
    this.setState({
      addVisible: false,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/addPersonalAgent',
      payload: values,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('新增成功');
          this.initialData('afterAdd');
          this.props.form.resetFields();
        } else message.error('新增失败:' + res.msg);
      },
    });
  };
  handleAddCancel = () => {
    this.setState({
      addVisible: false,
    });
  };
  // 点击详情
  handleClickDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/getAgentDetail',
      payload: id,
      callback: res => {
        this.setState({
          info: res,
        });
      },
    });
    this.setState({
      activeKey: '2',
    });
  };
  // 点击tab
  handleClickTab = key => {
    this.setState({
      activeKey: key,
      // info: {},
    });
  };
  // 点击详情返回
  handleClickReturn = () => {
    this.setState({
      activeKey: '1',
      info: {},
    });
  };
  // 点击编辑
  handleClickEdit = info => {
    const { userType, realname, level, mobile, area, reward, id, companyName } = info;
    this.setState({
      editInfo: {
        userType,
        realname,
        level,
        mobile,
        area,
        reward,
        companyName,
      },
      editVisible: true,
      editId: id,
    });
  };
  // 编辑确认
  handleEditOk = values => {
    const { dispatch } = this.props;
    const { editId } = this.state;
    dispatch({
      type: 'userManage/addPersonalAgent',
      payload: { ...values, id: editId },
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('编辑成功');
          this.setState({
            editVisible: false,
          });
          this.initialData();
        } else message.error('编辑失败:' + res.msg);
      },
    });
  };
  handleEditCancel = () => {
    this.setState({
      editVisible: false,
      editInfo: {},
    });
  };
  // 多选
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  // 删除
  handleDelete = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/deleteAgent',
      payload: selectedRowKeys,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('删除成功');
          this.setState({
            selectedRowKeys: [],
          });
          this.initialData();
        } else {
          message.error('删除失败:' + res.msg);
          this.setState({
            selectedRowKeys: [],
          });
        }
      },
    });
  };
  // 点击关联
  handleAssociate = info => {
    const { realname, mobile, id } = info;
    this.setState({
      associateInfo: {
        realname,
        mobile,
        id,
      },
      associateVisible: true,
      associateId: id,
    });
  };
  //关联确认
  handleAssociateOk = values => {
    this.setState({
      associateVisible: false,
      associateInfo: {},
      associateId: '',
    });
    const { dispatch } = this.props;
    const { associateId } = this.state;
    dispatch({
      type: 'userManage/confirmAssociate',
      payload: { ...values, agentId: associateId },
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('关联成功');
          this.initialData();
        } else message.error('关联失败:' + res.msg);
      },
    });
  };
  handleAssociateCancel = () => {
    this.setState({
      associateVisible: false,
    });
  };
  // 解除关联
  handleRelease = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/release',
      payload: id,
      callback: res => {
        if (res.code === '000000') {
          message.success('解除成功');
          this.initialData();
        } else message.error('解除失败:' + res.msg);
      },
    });
  };
  render() {
    const { selectedRowKeys, pagination } = this.state;
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
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const { list } = this.props.userManage.companyAgent;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const alreadySelect = selectedRowKeys.length > 0;
    const columns = [
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          return (
            <>
              {record.state === 0 ? (
                <Popconfirm onConfirm={() => this.handleRelease(record.id)} title="确定要解除吗？">
                  <a href="javascript:;">解除关联</a>
                </Popconfirm>
              ) : record.state === 1 ? (
                <a href="javascript:;" onClick={() => this.handleAssociate(record)}>
                  关联
                </a>
              ) : null}
              {record.state === 1 ? (
                <>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => this.handleClickEdit(record)}>
                    编辑
                  </a>
                </>
              ) : null}
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.handleClickDetail(record.id)}>
                详情
              </a>
            </>
          );
        },
        width: 200,
        fixed: 'left',
      },
      {
        title: '代理等级',
        dataIndex: 'level',
        width: 100,
        render: (text, record) => {
          switch (text) {
            case 1:
              return '总代理';
            case 2:
              return '一级代理';
            case 3:
              return '二级代理';
            case 4:
              return '三级代理';
            default:
              return '无';
          }
        },
      },
      {
        title: '代理编号',
        dataIndex: 'id',
        width: 100,
        render: text => (text ? '6100' + idSlice(text, 4) : ''),
      },
      { title: '企业名称', dataIndex: 'companyName', width: 170 },
      { title: '联系人', dataIndex: 'realname', width: 120 },
      { title: '联系方式', dataIndex: 'mobile', width: 100 },
      {
        title: '代理状态',
        dataIndex: 'state',
        width: 100,
        render: text => {
          return text === 0 ? '已关联' : text === 1 ? '未关联' : '无';
        },
      },
      {
        title: '上级代理',
        dataIndex: 'parentName',
        width: 100,
        render: (text, record) => (record.parentid === 0 ? '平台直属' : text),
      },
      {
        title: '上级代理联系方式',
        dataIndex: 'parentPhone',
        width: 180,
        render: (text, record) => (record.parentid === 0 ? '无' : text),
      },
      { title: '分润比例', dataIndex: 'reward', width: 100 },
      {
        title: '累计订单总额（元）',
        dataIndex: 'orderPriceSum',
        width: 170,
        render: text => {
          return (text / 100).toFixed(2);
        },
      },
      { title: '累计订单总量', dataIndex: 'orderCountSum', width: 120 },
      { title: '设备总量', dataIndex: 'boxCountSum', width: 100 },
      { title: '已分配设备', dataIndex: 'boxCountAssign', width: 120 },
      { title: '待分配设备', dataIndex: 'boxCountWait', width: 120 },
      { title: '设备分配率', dataIndex: 'assignPercent', width: 120 },
      {
        title: '累计分润金额（元）',
        dataIndex: 'rewardSum',
        width: 170,
        render: text => {
          return (text / 100).toFixed(2);
        },
      },
      {
        title: '累计提现金额（元）',
        dataIndex: 'withdrawSum',
        width: 170,
        render: text => {
          return (text / 100).toFixed(2);
        },
      },
      {
        title: '剩余提现金额（元）',
        dataIndex: 'withdrawResultSum',
        width: 170,
        render: text => {
          return (text / 100).toFixed(2);
        },
      },
      { title: '负责区域', dataIndex: 'area', width: 200 },
      {
        title: '注册时间',
        dataIndex: 'createTime',
        render: text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '无'),
      },
    ];
    return (
      <div className={styles.contentWrapper}>
        <Tabs activeKey={this.state.activeKey} onChange={this.handleClickTab}>
          <TabPane tab="列表页" key="1">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem label="代理等级">
                    {getFieldDecorator('level', {
                      initialValue: '',
                    })(
                      <Select style={{ width: '150px' }}>
                        <Option value={1}>总代理</Option>
                        <Option value={2}>一级代理</Option>
                        <Option value={3}>二级代理</Option>
                        <Option value={4}>三级代理</Option>
                        <Option value={''}>全部</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="代理状态">
                    {getFieldDecorator('state', {
                      initialValue: '',
                    })(
                      <Select style={{ width: '150px' }}>
                        <Option value={0}>已关联</Option>
                        <Option value={1}>未关联</Option>
                        <Option value={''}>全部</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label="代理联系方式">
                    {getFieldDecorator('phone', {
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

            <div className={styles.tableWrapper}>
              <Card className={styles.operateBtns}>
                <Button type="primary" onClick={this.handleAddPersonalAgent}>
                  新增
                </Button>
                {/*{alreadySelect ? (*/}
                {/*  <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete()}>*/}
                {/*    <Button type="danger">删除</Button>*/}
                {/*  </Popconfirm>*/}
                {/*) : (*/}
                {/*  <Button type="danger" disabled>*/}
                {/*    删除*/}
                {/*  </Button>*/}
                {/*)}*/}
              </Card>
              <Table
                dataSource={list}
                columns={columns}
                rowKey="id"
                scroll={{ x: 3000 }}
                pagination={pager}
                onChange={this.handleTableChange}
                loading={this.props.loading}
              />
            </div>
            <CompanyModal
              onOk={this.handleAddOk}
              onCancel={this.handleAddCancel}
              visible={this.state.addVisible}
              type={1}
            />
            <EditModal
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              visible={this.state.editVisible}
              info={this.state.editInfo}
            />
            <AssociateModal
              onOk={this.handleAssociateOk}
              onCancel={this.handleAssociateCancel}
              visible={this.state.associateVisible}
              info={this.state.associateInfo}
            />
          </TabPane>
          <TabPane tab="详情页" key="2">
            <Details info={this.state.info} clickReturn={this.handleClickReturn} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Index;
