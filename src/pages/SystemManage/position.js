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
  Pagination,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Divider from 'antd/lib/divider';

const { Option } = Select;
const { TreeNode } = Tree;

@connect(({ position, loading }) => ({
  position,
  loading: loading.models.position,
}))
@Form.create()
class Position extends Component {
  state = {
    edit: true,
    delete: true,
    treeData: [],
    dataSource: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
    jobName: '',
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
        treeSelect: record ? record.pid : '',
      },
      () => {
        console.log(this.state.treeSelect);
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
      treeSelect: '',
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
    console.log(selectedKeys);
    this.setState({ selectedKeys });
    this.getMenu(1, selectedKeys);
  };

  deleteMenu(record) {
    const z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'position/deleteMenu',
      payload: {
        id: record.jobId,
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
        type: 'position/postMenu',
        payload: {
          jobName: fieldsValue['name'],
          pid: z.state.treeSelect,
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
                z.props.form.resetFields();
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
      console.log(z.state.record);
      // Should format date value before submit.
      dispatch({
        type: 'position/putMenu',
        payload: {
          id: z.state.record.jobId,
          jobName: fieldsValue['name'],
          pid: z.state.treeSelect,
        },
        callback: function(res) {
          if (res.code === '000000') {
            message.success(res.msg);
            z.setState(
              {
                treeSelect: '',
                record: {},
                visible: false,
              },
              () => {
                z.getMenu(z.state.current, '0');
                z.getTree();
                z.props.form.resetFields();
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
      type: 'position/getTree',
      payload: {
        pid: '0',
      },
      callback: function(res) {
        if (res.code === '000000') {
          z.setState({
            treeData: res.data,
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
      type: 'position/getMenu',
      payload: {
        jobName: z.state.jobName,
        page: page,
        per_page: 10,
        sortby: 'create_time',
        order: 'DESC',
        jobId: key,
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
      const jobName = fieldsValue['jobName'];
      this.setState(
        {
          jobName: jobName,
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
        jobName: '',
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

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            {this.state.edit ? (
              <a href="javascript:;" onClick={() => this.showDrawer(text, record)}>
                编辑
              </a>
            ) : (
              ''
            )}
            {this.state.edit && this.state.delete ? <Divider type="vertical" /> : ''}
            {this.state.delete ? (
              <Popconfirm
                title={`是否删除${record.jobName}？`}
                onConfirm={() => this.deleteMenu(record)}
              >
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : (
              ''
            )}
          </span>
        ),
      },
      {
        title: '职位名称',
        dataIndex: 'jobName',
        key: 'jobName',
      },
      {
        title: '上级职位',
        dataIndex: 'parentJobName',
        key: 'parentJobName',
      },
      // {
      //   title: '排序',
      //   dataIndex: 'code',
      //   key: 'code',
      // },
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
                <Form.Item className={styles.form} label="职位名称">
                  {getFieldDecorator('jobName', {})(
                    <Input placeholder="请输入职位名称进行搜索" className={styles.input} />
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
              rowKey="jobId"
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
                <Form.Item label="职位名称">
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入菜单名称' },
                      { message: '长度不能超过20', max: 20 },
                    ],
                    initialValue: this.state.record ? this.state.record.jobName : '',
                  })(<Input placeholder="请输入菜单名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="上级职位">
                  {getFieldDecorator('treeSelect', {
                    rules: [{ required: true, message: '请选择上级职位' }],
                    initialValue: this.state.treeSelect ? this.state.treeSelect : '',
                  })(
                    <TreeSelect
                      placeholder="请选择上级职位"
                      style={{ width: 300 }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      allowClear
                      treeDefaultExpandAll
                      onChange={this.treeSelectChange}
                    >
                      <TreeNode title="无" key="0" dataRef="0" value="0" />
                      {this.renderTreeNodes2(this.state.treeData)}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/*<Row gutter={16}>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item label="排序">*/}
            {/*      {getFieldDecorator('url', {*/}
            {/*        rules: [{ required: true, message: '请输入排序' }],*/}
            {/*        initialValue: this.state.record ? this.state.record.url : '',*/}
            {/*      })(<Input placeholder="请输入排序"/>)}*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Position;
