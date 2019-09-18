import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Divider, message } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import RoleModal from '@/pages/Authority/modals/roleModal';
import { roleEdit } from '@/services/role';
import selfStyle from '@/pages/AlreadyOut/index.less';
const FormItem = Form.Item;
const { Column } = Table;

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class Role extends Component {
  state = {
    payload: {
      condition: {},
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
    visible: false,
    editInfo: {},
  };
  initialData = type => {
    const {
      pagination: { current },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getRoleList',
      payload: {
        condition: {},
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
          //  关联
          editInfo: {},
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
          type: 'role/getRoleList',
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
  // 点击新增或编辑
  handleClickModal = info => {
    if (info) {
      const { type, record } = info;
      this.setState({
        editInfo: {
          type,
        },
      });
      if (record) {
        roleEdit(record.id).then(res => {
          if (res.code === '000000')
            this.setState({
              editInfo: {
                id: record.id,
                roleName: record.roleName,
                viewIds: res.data,
                type,
              },
            });
        });
      }
    }
    this.setState({
      visible: true,
    });
  };
  // 新增或编辑确认
  handleModalOk = values => {
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    const { editInfo } = this.state;
    let payload = { ...values };
    if (editInfo.id) {
      payload = { ...values, id: editInfo.id };
    }
    dispatch({
      type: 'role/roleOperate',
      payload: payload,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('操作成功');
          this.initialData(editInfo.type === 'add' ? 'afterAdd' : '');
          this.props.form.resetFields();
        } else message.error('操作失败:' + res.msg, 6);
        this.setState({
          editInfo: {},
        });
      },
    });
  };
  handleModalCancel = () => {
    this.setState({
      visible: false,
      editInfo: {},
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const { pagination } = this.state;
    const { list } = this.props.role.roleList;
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
        render: (text, record) => {
          return (
            <>
              <a href="javascript:;">删除</a>
              <Divider type="vertical" />
              <a
                href="javascript:;"
                onClick={() => this.handleClickModal({ type: 'edit', record })}
              >
                编辑
              </a>
            </>
          );
        },
      },
      { title: '角色名称', dataIndex: 'roleName' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
      },
      { title: '创建人', dataIndex: 'creator' },
    ];
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.tableWrapper}>
          <Card className={styles.operateBtns}>
            <Button type="primary" onClick={() => this.handleClickModal({ type: 'add' })}>
              新增
            </Button>
          </Card>
          <Table
            bordered
            dataSource={list}
            columns={columns}
            rowKey="id"
            pagination={pager}
            onChange={this.handleTableChange}
          />
        </div>
        <RoleModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={this.state.visible}
          info={this.state.editInfo}
        />
      </div>
    );
  }
}

export default Role;
