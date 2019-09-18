import React, { useState, Component } from 'react';
import { Form, Table, Input, Button, Divider, Card, Popconfirm, Tabs, message } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import Details from '@/pages/User/shop/details';
import AssociateModal from '@/pages/User/shop/modals/associateModal';
import ShopModal from '@/pages/User/shop/modals/shopModal';
import selfStyle from '@/pages/AlreadyOut/index.less';
const FormItem = Form.Item;
const { Column } = Table;
const TabPane = Tabs.TabPane;
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class CompanyAgent extends Component {
  state = {
    payload: {
      condition: {
        parentPhone: '',
        phone: '',
      },
      desc: true,
      nowPage: 1,
      orderCondition: ['orderPriceSum'],
      pageSize: 10,
    },
    initPage: 1,
    pagination: {
      current: 1,
      pageSize: 10,
      total: '',
    },
    activeKey: '1',
    //  详情
    info: {},
    //  关联
    associateVisible: false,
    associateInfo: {},
    associateId: '',
    visible: false,
    editInfo: {},
    selectedRowKeys: [],
  };
  initialDispatch = type => {
    const {
      pagination: { current },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/getShopList',
      payload: {
        condition: {
          parentPhone: '',
          phone: '',
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
          info: {},
          //  关联
          associateInfo: {},
          editInfo: {},
        });
      },
    });
  };
  componentDidMount() {
    this.initialDispatch();
  }
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
    const { dispatch } = this.props;
    this.setState(
      {
        payload: {
          condition: {
            parentPhone: '',
            phone: '',
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
      () => this.initialDispatch()
    );
  };
  // 点击搜索
  handleSearch = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    const { payload } = this.state;
    validateFields(['phone', 'parentPhone'], (errors, values) => {
      payload.condition = { ...values };
      payload.nowPage = 1;
      dispatch({
        type: 'userManage/getShopList',
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
          type: 'userManage/getShopList',
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
  // 点击详情
  handleClickDetail = record => {
    this.setState({
      info: record,
      activeKey: '2',
    });
  };
  // 点击关联
  handleAssociate = info => {
    const { name, linkman, id, linktel } = info;
    this.setState({
      associateInfo: {
        name,
        linkman,
        linktel,
        id,
      },
      associateVisible: true,
    });
  };
  //关联确认
  handleAssociateOk = values => {
    const { dispatch } = this.props;
    const { associateInfo } = this.state;
    dispatch({
      type: 'userManage/confirmShopAssociate',
      payload: { ...values, sellerId: associateInfo.id },
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('关联成功');
          this.initialDispatch();
          this.setState({
            associateVisible: false,
          });
        } else message.error('关联失败:' + res.msg);
      },
    });
  };
  handleAssociateCancel = () => {
    this.setState({
      associateVisible: false,
      associateInfo: {},
    });
  };
  // 点击新增或编辑
  handleClickModal = info => {
    if (info) {
      const { address, linkman, openTime, personCost, linktel, id, name, type } = info;
      this.setState({
        editInfo: {
          address,
          linkman,
          openTime,
          personCost,
          linktel,
          id,
          name,
          type,
        },
      });
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
      type: 'userManage/shopOperate',
      payload: payload,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('操作成功');
          this.initialDispatch('afterAdd');
          this.props.form.resetFields();
        } else message.error('操作失败:' + res.msg);
      },
    });
  };
  handleModalCancel = () => {
    this.setState({
      visible: false,
      editInfo: {},
    });
  };
  // 解除关联
  handleRelease = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/shopRelease',
      payload: id,
      callback: res => {
        if (res.code === '000000') {
          message.success('解除成功');
          this.initialDispatch();
        } else message.error('解除失败:' + res.msg);
      },
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
      type: 'userManage/deleteShop',
      payload: selectedRowKeys,
      callback: res => {
        if (res.code && res.code === '000000') {
          message.success('删除成功');
          this.setState({
            selectedRowKeys: [],
          });
          this.initialDispatch();
        } else {
          message.error('删除失败:' + res.msg);
          this.setState({
            selectedRowKeys: [],
          });
        }
      },
    });
  };
  // 商户编号处理
  idSlice = (num, length) => {
    //这里用slice和substr均可
    return (Array(length).join('0') + num).slice(-length);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props.userManage.shopList;
    const { pagination, selectedRowKeys } = this.state;
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
        <Tabs activeKey={this.state.activeKey} onChange={this.handleClickTab}>
          <TabPane tab="列表页" key="1">
            <div className={styles.wrapper}>
              <Card className={styles.searchBar}>
                <Form layout="inline">
                  <FormItem label="商家联系方式">
                    {getFieldDecorator('phone', {
                      rules: [
                        {
                          validator: this.mobileValidator,
                        },
                      ],
                    })(<Input style={{ width: '150px' }} />)}
                  </FormItem>
                  <FormItem label="上级代理联系方式">
                    {getFieldDecorator('parentPhone', {
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
                <Button type="primary" onClick={() => this.handleClickModal({ type: 'add' })}>
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
                rowKey="id"
                scroll={{ x: 3200 }}
                loading={this.props.loading}
                pagination={pager}
                onChange={this.handleTableChange}
              >
                <Column
                  title="操作"
                  dataIndex="operate"
                  render={(text, record) => (
                    <>
                      {record.state === 0 ? (
                        <Popconfirm
                          onConfirm={() => this.handleRelease(record.id)}
                          title="确定要解除吗？"
                        >
                          <a href="javascript:;">解除关联</a>
                        </Popconfirm>
                      ) : record.state === 1 ? (
                        <a href="javascript:;" onClick={() => this.handleAssociate(record)}>
                          关联
                        </a>
                      ) : null}
                      <Divider type="vertical" />
                      <a
                        href="javascript:;"
                        onClick={() => this.handleClickModal({ type: 'edit', ...record })}
                      >
                        编辑
                      </a>
                      <Divider type="vertical" />
                      <a href="javascript:;" onClick={() => this.handleClickDetail(record)}>
                        详情
                      </a>
                    </>
                  )}
                  width={200}
                  fixed="left"
                />
                <Column
                  title="商户编号"
                  dataIndex="id"
                  width={100}
                  render={text => '6100' + this.idSlice(text, 4)}
                />
                <Column title="商户名称" dataIndex="name" width={170} />
                <Column title="详细地址" dataIndex="address" width={200} />
                <Column title="联系人" dataIndex="linkman" width={100} />
                <Column title="联系电话" dataIndex="linktel" width={100} />
                <Column
                  title="商户状态"
                  dataIndex="state"
                  width={100}
                  render={(text, record) => (text === 0 ? '已关联' : text === 1 ? '未关联' : '无')}
                />
                <Column title="营业时间" dataIndex="openTime" width={140} />
                <Column title="人均消费" dataIndex="personCost" width={100} />
                <Column
                  title="上级代理"
                  dataIndex="parentAgentName"
                  width={140}
                  render={(text, record) => (record.state === 1 ? '无' : text)}
                />
                <Column
                  title="上级代理联系方式"
                  dataIndex="parentAgentPhone"
                  width={170}
                  render={(text, record) => (record.state === 1 ? '无' : text)}
                />
                <Column
                  title="分润比例"
                  dataIndex="reward"
                  width={100}
                  render={text => text + '%'}
                />
                <Column
                  title="累计订单总额（元）"
                  dataIndex="orderPriceSum"
                  width={170}
                  render={text => (text / 100).toFixed(2)}
                />
                <Column title="累计订单总量" dataIndex="orderCountSum" width={170} />
                <Column
                  title="昨日订单总额（元）"
                  dataIndex="yesterdayOrderPriceSum"
                  width={170}
                  render={text => (text / 100).toFixed(2)}
                />
                <Column title="昨日订单总量" dataIndex="yesterdayOrderCount" width={170} />
                <Column title="设备数量" dataIndex="boxCountSum" width={100} />
                <Column
                  title="累计分润总额（元)"
                  dataIndex="rewardSum"
                  width={170}
                  render={text => (text / 100).toFixed(2)}
                />
                <Column
                  title="累计提现金额（元)"
                  dataIndex="withdrawSum"
                  width={170}
                  render={text => (text / 100).toFixed(2)}
                />
                <Column
                  title="剩余提现金额（元)"
                  dataIndex="withdrawResultSum"
                  width={170}
                  render={text => (text / 100).toFixed(2)}
                />
                <Column
                  title="注册时间"
                  dataIndex="createTime"
                  render={text => moment(text).format('YYYY/MM/DD HH:mm:ss')}
                />
              </Table>
            </div>
            <AssociateModal
              onOk={this.handleAssociateOk}
              onCancel={this.handleAssociateCancel}
              visible={this.state.associateVisible}
              info={this.state.associateInfo}
            />
            <ShopModal
              onOk={this.handleModalOk}
              onCancel={this.handleModalCancel}
              visible={this.state.visible}
              info={this.state.editInfo}
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

export default CompanyAgent;
