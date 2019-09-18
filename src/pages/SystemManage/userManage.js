import React, { Component } from 'react';
import { mobileValidator } from '@/utils/handleNumber';
import {
  Table,
  Row,
  Col,
  Input,
  Button,
  Form,
  message,
  Select,
  Popconfirm,
  Drawer,
  Modal,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Divider from 'antd/lib/divider';
import InputNumber from 'antd/lib/input-number';

const { Option } = Select;

@connect(({ operationUserManage, loading }) => ({
  operationUserManage,
  loading: loading.models.operationUserManage,
}))
@Form.create()
class UserManage extends Component {
  state = {
    role: [],
    sex: [],
    type: [],
    record: {},
    current: 1,
    pageSize: 10,
    total: 0,
    account: '',
    mobile: '',
    userType: '',
    loading: false,
    visible: false,
    searchType: '',
  };

  showDrawer = (text, record) => {
    this.setState(
      {
        record: record,
      },
      () => {
        this.setState({
          visible: true,
        });
      }
    );
  };

  onClose = () => {
    this.props.form.resetFields();
    this.setState({
      record: {},
      visible: false,
    });
  };

  add = () => {
    let z = this;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      // Should format date value before submit.
      if (err) {
        return;
      }
      dispatch({
        type: 'operationUserManage/addUser',
        payload: {
          userId: z.state.record && z.state.record.userId ? z.state.record.userId : '',
          name: fieldsValue['name'],
          phone: fieldsValue['phone'],
          roleId: fieldsValue['roleId'],
          sex: fieldsValue['sex'],
          userType: fieldsValue['userType'],
        },
        callback: function(res) {
          z.setState({ record: {} });
          z.props.form.resetFields();
          console.log(res);
          if (res.code === '000000') {
            message.success(res.msg);
            z.setState(
              {
                visible: false,
              },
              () => {
                z.getUser(z.state.current);
              }
            );
          } else {
            message.error(res.msg);
          }
        },
      });
    });
  };

  getDict() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'operationUserManage/getDict',
      payload: {},
      callback: function(res) {
        console.log(res);
        if (res.code === '000000') {
          if (res.data.SEX) {
            z.setState({
              sex: z.createOption(res.data.SEX.dicts),
            });
          }
          if (res.data.USER_TYPE) {
            z.setState({
              type: z.createOption(res.data.USER_TYPE.dicts),
            });
          }
        }
      },
    });
  }

  getRole() {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'operationUserManage/getRole',
      payload: {
        page: 1,
        per_page: 100000,
        order: 'DESC',
      },
      callback: function(res) {
        if (res.code === '000000') {
          const list = res.data.list;
          let role = [];
          list.forEach(item => {
            console.log(item.name, item.roleId);
            role.push(<Option key={item.roleId}>{item.name}</Option>);
          });
          z.setState({ role: role });
        }
      },
    });
  }

  getUser(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'operationUserManage/getUser',
      payload: {
        account: this.state.account,
        mobile: this.state.mobile,
        userType: this.state.searchType,
        page: page,
        per_page: 10,
        order: 'DESC',
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

  resetPwd(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationUserManage/resetPwd',
      payload: {
        userId: record.userId,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      },
    });
  }

  createOption(list) {
    const option = [];
    list.forEach(item => {
      option.push(<Option key={item.payload.code}>{item.title}</Option>);
    });
    return option;
  }

  componentDidMount() {
    this.getUser(1);
    this.getRole();
    this.getDict();
  }

  handleSubmit = e => {
    this.props.form.validateFields((err, fieldsValue) => {
      // Should format date value before submit.
      const account = fieldsValue['account'];
      const mobile = fieldsValue['mobile'];
      this.setState(
        {
          account: account,
          mobile: mobile,
        },
        () => {
          this.getUser(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        account: '',
        mobile: '',
        userType: '',
      },
      () => {
        this.getUser(1);
      }
    );
  };

  toDecimal(x) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.operationUserManage.user
      ? this.props.operationUserManage.user.list
      : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.showDrawer(text, record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title={`是否重置${record.name}的密码？重置后密码为123456`}
              onConfirm={() => this.resetPwd(record)}
            >
              <a href="javascript:;">重置密码</a>
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '用户ID',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '用户账号',
        dataIndex: 'account',
        key: 'account',
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用户类型',
        dataIndex: 'userTypes',
        key: 'userTypes',
      },
      {
        title: '性别',
        dataIndex: 'userSexStr',
        key: 'userSexStr',
      },
      {
        title: '角色',
        dataIndex: 'userRoles',
        key: 'userRoles',
      },
      {
        title: '联系方式',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function handleChange(value) {
      z.setState({
        searchType: value,
      });
    }

    function pageChange(page) {
      z.getUser(page);
    }

    function onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
      z.setState(
        {
          current: current,
          pageSize: pageSize,
        },
        () => {
          z.getMenu(1, z.state.selectedKeys);
        }
      );
    }

    return (
      <div>
        <Row className={styles.bgc}>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form} label="用户账号">
                {getFieldDecorator('account', {})(
                  <Input placeholder="请输入用户账号进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="联系方式">
                {getFieldDecorator('mobile', {})(
                  <Input placeholder="请输入联系方式进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="用户类型">
                <Select style={{ width: 120 }} onChange={handleChange} defaultValue="">
                  <Option value="">全部</Option>
                  {this.state.type}
                </Select>
              </Form.Item>
            </Form>
            <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
              搜索
            </Button>
            <Button type="danger" onClick={this.handleClearSearch} className={styles.btn}>
              重置
            </Button>
            <Button
              type="normal"
              icon="plus-circle"
              onClick={this.showDrawer}
              className={styles.btn}
            >
              新增
            </Button>
          </Col>
          <Table
            className={styles.table}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: onShowSizeChange,
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
            rowKey="userId"
            bordered
            scroll={{ x: 1000 }}
            dataSource={dataSource}
            columns={columns}
          />
        </Row>

        <Modal visible={this.state.visible} onOk={this.add} onCancel={this.onClose} width={720}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="用户姓名">
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入用户姓名' },
                      { message: '长度不能超过20', max: 20 },
                    ],
                    initialValue: this.state.record ? this.state.record.name : '',
                  })(<Input placeholder="请输入用户姓名" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: '请输入手机号码' },
                      { validator: mobileValidator },
                    ],
                    initialValue: this.state.record ? this.state.record.phone : '',
                  })(<Input type="number" placeholder="请输入手机号码" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="用户类型">
                  {getFieldDecorator('userType', {
                    rules: [{ required: true, message: '请选择用户类型' }],
                    initialValue: this.state.record ? this.state.record.userType : '',
                  })(<Select placeholder="请选择用户类型">{this.state.type}</Select>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="性别">
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                    initialValue: this.state.record ? this.state.record.sex : '',
                  })(<Select placeholder="请选择性别">{this.state.sex}</Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="角色">
                  {getFieldDecorator('roleId', {
                    rules: [{ required: true, message: '请选择角色' }],
                    initialValue: this.state.record ? this.state.record.roleIds : undefined,
                  })(
                    <Select mode="multiple" placeholder="请选择角色">
                      {this.state.role}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default UserManage;
