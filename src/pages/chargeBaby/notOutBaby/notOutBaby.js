import React, { useState, Component } from 'react';
import {
  Form,
  Table,
  Input,
  Select,
  Button,
  Divider,
  Card,
  Popconfirm,
  DatePicker,
  message,
} from 'antd';
import styles from '@/pages/mylayout.less';
import moment from 'moment';
import { connect } from 'dva/index';
import EditModal from '@/pages/chargeBaby/notOutBaby/modal/editModal';
import ImportModal from '@/pages/chargeBaby/notOutBaby/modal/importModal';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;
const { Column } = Table;
@connect(({ chargeBaby, loading }) => ({
  chargeBaby,
  loading: loading.models.chargeBaby,
}))
@Form.create()
class NotOut extends Component {
  state = {
    payload: {
      condition: {
        batchName: '',
      },
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
    editInfo: {},
    editVisible: false,
    scrapInfo: {},
    scrapVisible: false,
    importVisible: false,
    selectedRowKeys: [],
  };
  // 初始化列表
  initialData = () => {
    const { dispatch } = this.props;
    const {
      pagination: { current },
    } = this.state;
    dispatch({
      type: 'chargeBaby/getNotOutBabyList',
      payload: {
        condition: {
          batchName: '',
        },
        desc: true,
        nowPage: current,
        orderCondition: [],
        pageSize: 10,
      },
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
  };
  componentDidMount() {
    this.initialData();
  }
  // 多选
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
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
          type: 'chargeBaby/getNotOutBabyList',
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
    validateFields(['batchName'], (errors, values) => {
      payload.condition = { ...values };
      payload.nowPage = 1;
      dispatch({
        type: 'chargeBaby/getNotOutBabyList',
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
    });
  };
  //重置
  handleClearSearch = () => {
    this.props.form.resetFields();
    const { dispatch } = this.props;
    this.setState(
      {
        payload: {
          condition: {
            batchName: '',
          },
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
      },
      () => this.initialData()
    );
  };
  // 点击编辑
  handleClickEdit = record => {
    this.setState({
      editInfo: {
        terminalId: record.terminalId,
      },
      editVisible: true,
    });
  };
  // 编辑确认
  handleEditOk = values => {
    const {
      editInfo: { terminalId },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'chargeBaby/editNotOutBaby',
      payload: {
        ...values,
        terminalId,
      },
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('操作成功');
          this.setState(
            {
              editInfo: {},
              editVisible: false,
            },
            () => this.initialData()
          );
        } else {
          message.error('操作失败:' + res.msg, 6);
        }
      },
    });
  };
  //编辑取消
  handleCancelEdit = () => {
    this.setState({
      editInfo: {},
      editVisible: false,
    });
  };
  // 点击导入
  handleClickImport = record => {
    this.setState({
      importVisible: true,
    });
  };
  // 导入确认
  handleImportOk = () => {
    this.setState({
      importVisible: false,
    });
    this.initialData();
  };
  //导入取消
  handleCancelImport = () => {
    this.setState({
      importVisible: false,
    });
  };
  // 删除
  handleDelete = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'chargeBaby/deleteNotOutBaby',
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
    const {
      pagination,
      editInfo,
      scrapInfo,
      editVisible,
      scrapVisible,
      importVisible,
      selectedRowKeys,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props.chargeBaby.notOutBabyList;
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const alreadySelect = selectedRowKeys.length > 0;
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="批次名称">
                {getFieldDecorator('batchName')(<Input style={{ width: '150px' }} />)}
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
            <Button type="primary" onClick={this.handleClickImport}>
              导入小宝
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
            rowKey="terminalId"
            rowSelection={rowSelection}
            loading={this.props.loading}
            pagination={pager}
            onChange={this.handleTableChange}
          >
            <Column
              title="操作"
              dataIndex="operate"
              render={(text, record) => (
                <>
                  <a href="javascript:;" onClick={() => this.handleClickEdit(record)}>
                    编辑
                  </a>
                </>
              )}
            />
            <Column title="批次名称" dataIndex="batchName" />
            <Column title="小宝编号" dataIndex="terminalId" />
            <Column
              title="入库日期"
              dataIndex="createTime"
              render={text => (text ? moment(text).format('YYYY/MM/DD HH:mm:ss') : '')}
            />
          </Table>
          <EditModal
            visible={editVisible}
            editInfo={editInfo}
            onOk={this.handleEditOk}
            onCancel={this.handleCancelEdit}
          />
          <ImportModal
            visible={importVisible}
            onOk={this.handleImportOk}
            onCancel={this.handleCancelImport}
          />
        </div>
      </div>
    );
  }
}

export default NotOut;
