import React, { useState, Component } from 'react';
import {
  Form,
  Table,
  Input,
  Select,
  Button,
  Card,
  Divider,
  message,
  Popconfirm,
  Modal,
} from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import InputNumber from 'antd/es/input-number';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;

@connect(({ admin, loading }) => ({
  admin,
  loading: loading.models.admin,
}))
@Form.create()
class Admin extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visible: false,
    confirmLoading: false,
    selectedItems: '',
    roles: '',
    type: 0,
    id: '',
  };

  getAdmin(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/getAdmin',
      payload: {
        condition: {},
        desc: true,
        nowPage: page,
        orderCondition: [],
        pageSize: 10,
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
        }
      },
    });
  }

  getRole() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/getRole',
    });
  }

  deleteAdmin(record) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/deleteAdmin',
      payload: { id: record.id },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getAdmin(1);
      },
    });
  }

  addAdmin(realname, username) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/addAdmin',
      payload: {
        realname,
        username,
        roles: [z.state.roles],
      },
      callback: function(res) {
        z.props.form.setFieldsValue({
          realname: '',
          username: '',
        });
        z.setState({
          selectedItems: '',
          roles: '',
          visible: false,
          confirmLoading: false,
        });
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getAdmin(1);
      },
    });
  }

  putAdmin(realname, username, password) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/putAdmin',
      payload: {
        realname,
        username,
        password,
        roles: [z.state.roles],
        id: z.state.id,
      },
      callback: function(res) {
        z.props.form.setFieldsValue({
          realname: '',
          username: '',
          password: '',
        });
        z.setState({
          selectedItems: '',
          roles: '',
          id: '',
          visible: false,
          confirmLoading: false,
        });
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getAdmin(1);
      },
    });
  }

  componentDidMount() {
    this.getAdmin(1);
  }

  handleChange = (selectedItems, option) => {
    this.setState({
      selectedItems,
      roles: option.key,
    });
  };

  showModal = (type, record) => {
    if (type === 2) {
      this.setState({
        id: record.id,
      });
      if (record.roles.length >= 1) {
        this.setState({
          selectedItems: record.roles[0].roleName,
          roles: record.roles[0].id,
        });
      }
      this.props.form.setFieldsValue({
        realname: record.realname,
        username: record.username,
      });
    } else {
      this.setState({
        selectedItems: '',
        roles: '',
      });
      this.props.form.setFieldsValue({
        realname: '',
        username: '',
      });
    }
    this.setState(
      {
        type: type,
      },
      () => {
        this.getRole();
        this.setState({
          visible: true,
        });
      }
    );
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    if (this.state.type === 1) {
      this.props.form.validateFields((err, value) => {
        if (err) {
          return;
        }
        // Should format date value before submit.
        const realname = value['realname'];
        const username = value['username'];
        this.addAdmin(realname, username);
      });
    } else if (this.state.type === 2) {
      this.props.form.validateFields((err, value) => {
        if (err) {
          return;
        }
        // Should format date value before submit.
        const realname = value['realname'];
        const username = value['username'];
        const password = value['password'];
        this.putAdmin(realname, username, password);
      });
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const data = this.props.admin.admin ? this.props.admin.admin.list : [];
    const columns = [
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          return (
            <>
              <Popconfirm
                title={`是否删除账号为${record.username}的账号？`}
                onConfirm={() => this.deleteAdmin(record)}
              >
                <a href="javascript:;" className={styles.red}>
                  {' '}
                  删除
                </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.showModal(2, record)}>
                编辑
              </a>
            </>
          );
        },
      },
      { title: '管理员名称', dataIndex: 'realname', key: 'realname' },
      { title: '管理员账号', dataIndex: 'username', key: 'username' },
      { title: '所属角色', dataIndex: 'roles[0].roleName', key: 'roles[0].roleName' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      { title: '创建人', dataIndex: 'creatorName', key: 'creatorName' },
    ];

    const OPTIONS = this.props.admin.role ? this.props.admin.role : [];
    const { selectedItems } = this.state;
    const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));

    function pageChange(page) {
      z.getAdmin(page);
    }

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.tableWrapper}>
          <Card className={styles.operateBtns}>
            <Button type="primary" onClick={() => this.showModal(1)}>
              新增
            </Button>
          </Card>
          <Table
            pagination={{
              defaultCurrent: 1,
              current: this.state.current,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: pageChange,
              showTotal: () => {
                return (
                  <div className={selfStyle.total}>
                    <p>共计：{this.state.total} 条</p>
                  </div>
                );
              },
            }}
            loading={this.state.loading}
            rowKey="id"
            bordered
            dataSource={data}
            columns={columns}
          />
        </div>
        <Modal
          title="采购审核"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form>
            <Form.Item label="管理员名称">
              {getFieldDecorator('realname', {})(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="管理员账号">
              {getFieldDecorator('username', {})(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            {this.state.type === 2 ? (
              <Form.Item label="管理员密码">
                {getFieldDecorator('password', {})(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            ) : (
              ''
            )}
            <Form.Item label="所属角色">
              <Select
                placeholder="Inserted are removed"
                value={selectedItems}
                onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                {filteredOptions.map(item => (
                  <Select.Option key={item.id} value={item.roleName}>
                    {item.roleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Admin;
