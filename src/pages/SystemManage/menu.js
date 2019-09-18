import React, { Component } from 'react';
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
  TreeSelect,
  Tree,
  Radio,
  InputNumber,
  Modal,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Divider from 'antd/lib/divider';

const { Option } = Select;
const { TreeNode } = Tree;

@connect(({ menuManage, loading }) => ({
  menuManage,
  loading: loading.models.menuManage,
}))
@Form.create()
class Menu extends Component {
  state = {
    treeData: [],
    treeData2: [],
    dataSource: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
    menuName: '',
    record: {},
    treeSelect: '',
  };

  add = () => {
    if (this.state.record) {
      this.putMenu();
    } else {
      this.postMenu();
    }
  };

  showDrawer = (text, record) => {
    this.setState(
      {
        record: record,
        treeSelect: record ? record.pcode : '',
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

  treeSelectChange = value => {
    console.log(value);
    this.setState({
      treeSelect: value,
    });
  };

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
    this.getMenu(1, selectedKeys);
  };

  deleteMenu(record) {
    const z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/deleteMenu',
      payload: {
        id: record.menuId,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
          z.getMenu(z.state.current, '0');
          z.getTree();
        } else {
          message.error(res.msg);
        }
      },
    });
  }

  postMenu() {
    const z = this;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      dispatch({
        type: 'menuManage/postMenu',
        payload: {
          name: fieldsValue['name'],
          code: fieldsValue['code'],
          pcode: z.state.treeSelect,
          menuFlag: fieldsValue['menuFlag'],
          url: fieldsValue['url'],
          sort: fieldsValue['sort'],
        },
        callback: function(res) {
          if (res.code === '000000') {
            message.success(res.msg);
            z.setState(
              {
                record: {},
                visible: false,
              },
              () => {
                z.getMenu(z.state.current, '0');
                z.getTree();
              }
            );
          } else {
            message.error(res.msg);
          }
        },
      });
    });
  }

  putMenu() {
    const z = this;
    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      dispatch({
        type: 'menuManage/putMenu',
        payload: {
          id: z.state.record.menuId,
          name: fieldsValue['name'],
          code: fieldsValue['code'],
          pcode: z.state.treeSelect,
          menuFlag: fieldsValue['menuFlag'],
          url: fieldsValue['url'],
          sort: fieldsValue['sort'],
        },
        callback: function(res) {
          if (res.code === '000000') {
            message.success(res.msg);
            z.setState(
              {
                record: {},
                visible: false,
              },
              () => {
                z.getMenu(z.state.current, '0');
                z.getTree();
              }
            );
          } else {
            message.error(res.msg);
          }
        },
      });
    });
  }

  getTree() {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/getTree',
      payload: {
        pcode: '0',
      },
      callback: function(res) {
        if (res.code === '000000') {
          z.setState({
            treeData: res.data,
            treeData2: res.data,
          });
        }
        z.setState({
          loading: false,
        });
      },
    });
  }

  getMenu(page, key) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'menuManage/getMenu',
      payload: {
        keywords: z.state.menuName,
        page: page,
        per_page: 10,
        order: 'DESC',
        pcode: key,
        sortby: 'create_time',
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            dataSource: res.data.list,
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
        }
      },
    });
  }

  componentDidMount() {
    this.getTree();
    this.getMenu(1, '0');
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  renderTreeNodes2 = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.key} title={item.title} key={item.key}>
            {this.renderTreeNodes2(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.key} title={item.title} key={item.key} />;
    });

  handleSubmit = e => {
    this.props.form.validateFields((err, fieldsValue) => {
      // Should format date value before submit.
      const menuName = fieldsValue['menuName'];
      this.setState(
        {
          menuName: menuName,
        },
        () => {
          this.getMenu(1, '0');
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        menuName: '',
      },
      () => {
        this.getTree();
        this.getMenu(1, '0');
      }
    );
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.menuManage.menu ? this.props.menuManage.menu.list : [];

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
              title={`是否删除${record.name}菜单？`}
              onConfirm={() => this.deleteMenu(record)}
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '图标',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '菜单编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '菜单父编号',
        dataIndex: 'pcode',
        key: 'pcode',
      },
      {
        title: '请求地址',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '是否是菜单',
        dataIndex: 'menuFlag',
        key: 'menuFlag',
        render: key => {
          if (key === '0') {
            return <span>是</span>;
          } else if (key === '1') {
            return <span>否</span>;
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'createTime',
        key: 'createTime',
      },
    ];

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    function pageChange(page) {
      z.getMenu(page, z.state.selectedKeys);
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
        <Row className={styles.treeBox}>
          <Tree
            className={styles.tree}
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
          <div className={styles.box}>
            <Col className={styles.col}>
              <Form className={styles.form}>
                <Form.Item className={styles.form} label="菜单名称">
                  {getFieldDecorator('menuName', {})(
                    <Input placeholder="请输入菜单名称进行搜索" className={styles.input} />
                  )}
                </Form.Item>
              </Form>
              <Button
                type="primary"
                icon="search"
                className={styles.btn}
                onClick={this.handleSubmit}
              >
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
              rowKey="code"
              bordered
              scroll={{ x: 1000 }}
              dataSource={this.state.dataSource}
              columns={columns}
            />
          </div>
        </Row>

        <Modal visible={this.state.visible} onOk={this.add} onCancel={this.onClose} width={720}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="菜单名称">
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入菜单名称' },
                      { message: '长度不能超过20', max: 20 },
                    ],
                    initialValue: this.state.record ? this.state.record.name : '',
                  })(<Input placeholder="请输入菜单名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="菜单编号">
                  {getFieldDecorator('code', {
                    rules: [
                      { required: true, message: '请输入菜单编号' },
                      { message: '长度不能超过20', max: 20 },
                    ],
                    initialValue: this.state.record ? this.state.record.code : '',
                  })(<Input type="number" placeholder="请输入菜单编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="父级菜单">
                  {getFieldDecorator('treeSelect', {
                    rules: [{ required: true, message: '请选择父级菜单' }],
                    initialValue: this.state.treeSelect ? this.state.treeSelect : '',
                  })(
                    <TreeSelect
                      placeholder="请选择父级菜单"
                      style={{ width: 300 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      allowClear
                      treeDefaultExpandAll
                      onChange={this.treeSelectChange}
                    >
                      {this.renderTreeNodes2(this.state.treeData)}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="是否是菜单">
                  {getFieldDecorator('menuFlag', {
                    initialValue: this.state.record ? this.state.record.menuFlag : '',
                  })(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value={'0'}>是</Radio>
                      <Radio value={'1'}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="请求地址">
                  {getFieldDecorator('url', {
                    rules: [
                      { required: true, message: '请输入请求地址' },
                      { message: '长度不能超过20', max: 50 },
                    ],
                    initialValue: this.state.record ? this.state.record.url : '',
                  })(<Input placeholder="请输入请求地址" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="排序">
                  {getFieldDecorator('sort', {
                    rules: [
                      { required: true, message: '请输入排序' },
                      { message: '长度不能超过20', max: 20 },
                    ],
                    initialValue: this.state.record ? this.state.record.sort : '',
                  })(<Input type="number" min={1} placeholder="请输入排序" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Menu;
