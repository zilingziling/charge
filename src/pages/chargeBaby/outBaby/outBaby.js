import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, DatePicker, message, Tabs } from 'antd';
import styles from '@/pages/mylayout.less';
import moment from 'moment';
import OutTab from '@/pages/chargeBaby/outBaby/modal/outTab';
import { connect } from 'dva';
import EditModal from '@/pages/chargeBaby/outBaby/modal/editModal';
import selfStyle from '@/pages/AlreadyOut/index.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(({ chargeBaby, loading }) => ({
  chargeBaby,
  loading: loading.models.chargeBaby,
}))
@Form.create()
class OutBaby extends Component {
  state = {
    payload: {
      condition: {
        mobile: '',
        staTime: '',
        endTime: '',
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
    editVisible: false,
    //  编辑信息
    editData: {},
    selectedRowKeys: [],
    editId: '',
    activeKey: '1',
  };
  // 初始化列表
  initialData = type => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'chargeBaby/getOutBabyList',
      payload: {
        condition: {
          mobile: '',
          staTime: '',
          endTime: '',
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
          editId: '',
        });
      },
    });
  };
  // 点击tab
  handleClickTab = key => {
    this.setState({
      activeKey: key,
      // info: {},
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
          type: 'chargeBaby/getOutBabyList',
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
    validateFields(['mobile', 'staTime', 'endTime'], (errors, values) => {
      if (values.staTime) values.staTime = moment(values.staTime).format('YYYY-MM-DD HH:mm:ss');
      if (values.endTime) values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss');
      if (!errors) {
        payload.condition = { ...values };
        payload.nowPage = 1;
        dispatch({
          type: 'chargeBaby/getOutBabyList',
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
            mobile: '',
            staTime: '',
            endTime: '',
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
  handleOutOk = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'chargeBaby/outBaby',
      payload: values,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('操作成功');
          this.initialData('afterAdd');
          this.props.form.resetFields();
          this.setState({
            activeKey: '1',
          });
        } else message.error('操作失败:' + res.msg, 6);
      },
    });
  };
  handleOutCancel = () => {
    this.setState({
      activeKey: '1',
    });
  };
  // 编辑
  onClickEdit = record => {
    this.setState({
      editData: { ...record },
      editVisible: true,
      editId: record.id,
    });
  };
  // 编辑确认
  handleEditOk = values => {
    const { editId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'chargeBaby/editOutBaby',
      payload: { ...values, id: editId },
      callback: res => {
        if (res.code === '000000') {
          message.success('操作成功');
          this.setState({
            editVisible: false,
          });
          this.initialData();
        } else message.error('操作失败:' + res.msg, 6);
      },
    });
  };
  handleEditCancel = () => {
    this.setState({
      editVisible: false,
      editId: '',
      editData: {},
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
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
    const { list } = this.props.chargeBaby.outBabyList;
    const columns = [
      {
        title: '操作',
        dataIndex: 'operate',
        fixed: 'left',
        width: 100,
        render: (text, record) => {
          return (
            <>
              <a href="javascript:;" onClick={() => this.onClickEdit(record)}>
                编辑
              </a>
            </>
          );
        },
      },
      { title: '快递单号', dataIndex: 'expressNo', width: 200 },
      { title: '出库类型', dataIndex: 'exportType', width: 100 },
      {
        title: '出库日期',
        dataIndex: 'createTime',
        render: text => moment(text).format('YYYY/MM/DD HH:mm:ss'),
        width: 200,
      },
      { title: '出库编号', dataIndex: 'id', width: 200 },
      { title: '出库总量', dataIndex: 'terminalNum', width: 100 },
      { title: '领取人', dataIndex: 'agentName', width: 100 },
      { title: '领取人联系方式', dataIndex: 'agentPhone', width: 150 },
      { title: '备注', dataIndex: 'details' },
    ];
    return (
      <div className={styles.contentWrapper}>
        <Tabs activeKey={this.state.activeKey} onChange={this.handleClickTab}>
          <TabPane tab="列表页" key="1">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem label="领取人联系方式">
                    {getFieldDecorator('mobile')(<Input style={{ width: '150px' }} />)}
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
            <div className={styles.tableWrapper}>
              <Table
                bordered
                dataSource={list}
                columns={columns}
                rowKey="id"
                pagination={pager}
                onChange={this.handleTableChange}
                scroll={{ x: 1800 }}
              />
            </div>
            <EditModal
              onOk={this.handleEditOk}
              onCancel={this.handleEditCancel}
              visible={this.state.editVisible}
              editData={this.state.editData}
            />
          </TabPane>
          <TabPane tab="出库" key="2">
            <OutTab onOk={this.handleOutOk} onCancel={this.handleOutCancel} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default OutBaby;
