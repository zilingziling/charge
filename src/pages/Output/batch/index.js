import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Divider, Card, message, Popconfirm } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import AddModal from '@/pages/Output/batch/modals/addModal';
import EditModal from '@/pages/Output/batch/modals/editModal';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;

@connect(({ outPut, loading }) => ({
  outPut,
  loading: loading.models.outPut,
}))
@Form.create()
class Batch extends Component {
  state = {
    payload: {
      condition: {
        name: '',
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
    selectedRowKeys: [],
    editId: '',
    success: false,
  };
  // 初始化列表
  initialData = type => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'outPut/getBatchList',
      payload: {
        condition: {
          name: '',
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
          type: 'outPut/getBatchList',
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
    validateFields(['name'], (errors, values) => {
      if (!errors) {
        payload.condition = { ...values };
        payload.nowPage = 1;
        dispatch({
          type: 'outPut/getBatchList',
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
            name: '',
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
  // 新增
  handleAddBatch = () => {
    this.setState({
      addVisible: true,
    });
  };

  // 新增确认
  handleAddOk = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'outPut/add',
      payload: values,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('添加成功');
          this.initialData('afterAdd');
          this.setState({
            addVisible: false,
          });
        } else message.error('添加失败:' + res.msg, 6);
      },
    });
  };
  handleAddCancel = () => {
    this.setState({
      addVisible: false,
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
      type: 'outPut/add',
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
      type: 'outPut/delete',
      payload: selectedRowKeys,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('删除成功');
          this.setState({
            selectedRowKeys: [],
          });
          this.initialData();
        } else {
          message.error('删除失败:' + res.msg, 6);
          this.setState({
            selectedRowKeys: [],
          });
        }
      },
    });
  };

  render() {
    const { pagination, selectedRowKeys, success } = this.state;
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
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
    const { list } = this.props.outPut.batchList;
    const alreadySelect = selectedRowKeys.length > 0;
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
      { title: '批次名称', dataIndex: 'name', width: 250 },
      { title: '订单总量（套）', dataIndex: 'orderCount', width: 130 },
      {
        title: '订单金额（元）',
        dataIndex: 'orderPrice',
        width: 130,
        render: text => {
          return (text / 100).toFixed(2);
        },
      },
      {
        title: '已到货',
        dataIndex: 'arrivalBoxCount',
        render: text => (text ? text : 0),
        width: 120,
      },
      { title: '未出库设备', dataIndex: 'waitAssignCount', width: 140 },
      { title: '已出库设备', dataIndex: 'alradyAssignCount', width: 140 },
      {
        title: '下单日期',
        dataIndex: 'orderDate',
        width: 200,
        render: text => {
          return moment(text).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      { title: '备注', dataIndex: 'description' },
    ];
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="批次">
                {getFieldDecorator('name')(
                  <Input style={{ width: '300px' }} placeholder="请输入批次名称" />
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
        <div className={styles.tableWrapper}>
          <Card className={styles.operateBtns}>
            <Button type="primary" onClick={this.handleAddBatch}>
              新增
            </Button>
            {alreadySelect ? (
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDelete()}>
                <Button type="danger">删除</Button>
              </Popconfirm>
            ) : (
              <Button type="danger" disabled>
                删除
              </Button>
            )}
          </Card>
          <Table
            bordered
            dataSource={list}
            columns={columns}
            rowKey="id"
            rowSelection={rowSelection}
            pagination={pager}
            onChange={this.handleTableChange}
            loading={this.props.loading}
            scroll={{ x: 1800 }}
          />
        </div>
        <AddModal
          onOk={this.handleAddOk}
          onCancel={this.handleAddCancel}
          visible={this.state.addVisible}
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

export default Batch;
