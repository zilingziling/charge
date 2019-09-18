import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Divider, Tabs, message, Radio, Modal } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import { ChartCard, yuan } from 'ant-design-pro/lib/Charts';
import moment from 'moment';

const TabPane = Tabs.TabPane;

@connect(({ unBundle, loading }) => ({
  unBundle,
  loading: loading.models.unBundle,
}))
@Form.create()
class ApplyFor extends Component {
  state = {
    sellerPhone: '',
    agentPhone: '',
    activeKey: '1',
    id: '',
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visible: false,
    confirmLoading: false,
    details: {},
    radio: 0,
  };

  idSlice(num, length) {
    //这里用slice和substr均可
    return (Array(length).join('0') + num).slice(-length);
  }
  getApply(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'unBundle/applyFor',
      payload: {
        condition: {
          state: 1,
          sellerPhone: z.state.sellerPhone,
          agentPhone: z.state.agentPhone,
        },
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

  getDetails(id) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'unBundle/details',
      payload: { id: id },
      callback: function(res) {
        if (res.data) {
          z.setState({
            details: res.data,
          });
        }
      },
    });
  }

  audit(state, result) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'unBundle/audit',
      payload: { id: this.state.id, state: state, details: result },
      callback: function(res) {
        z.setState({
          visible: false,
          confirmLoading: false,
        });
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getApply(1);
      },
    });
  }

  componentDidMount() {
    this.getApply(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const sellerPhone = fieldsValue['sellerPhone'];
      const agentPhone = fieldsValue['agentPhone'];
      this.setState(
        {
          sellerPhone: sellerPhone,
          agentPhone: agentPhone,
        },
        () => {
          this.getApply(1);
        }
      );
    });
  };

  details = (text, record) => {
    this.getDetails(record.id);
    this.setState({ activeKey: '2' });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
  };

  showModal = (text, record) => {
    this.setState(
      {
        visible: true,
        id: record.id,
        radio: 0,
      },
      () => {
        this.props.form.setFieldsValue({
          'radio-group': 0,
        });
        if (this.props.form.result) {
          this.props.form.setFieldsValue({
            result: '',
          });
        }
      }
    );
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const result = value['result'];
      const state = value['radio-group'];
      this.audit(state, result);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onRadioChange = e => {
    this.setState({
      radio: e.target.value,
    });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.unBundle.apply ? this.props.unBundle.apply.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              className={styles.red}
              onClick={() => this.showModal(text, record)}
            >
              审核
            </a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
          </span>
        ),
      },
      {
        title: '商户名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '联系人',
        dataIndex: 'sellerLinkman',
        key: 'sellerLinkman',
      },
      {
        title: '联系方式',
        dataIndex: 'sellerLinktel',
        key: 'sellerLinktel',
      },
      {
        title: '申请代理',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '代理联系方式',
        dataIndex: 'agentPhone',
        key: 'agentPhone',
      },
      {
        title: '解绑原因',
        dataIndex: 'info',
        key: 'info',
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function pageChange(page) {
      z.getApply(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.pane}>
            <Row>
              <Col className={styles.col}>
                <Form className={styles.form}>
                  <Form.Item className={styles.form} label="商户联系方式">
                    {getFieldDecorator('sellerPhone', {})(
                      <Input placeholder="请输入商户联系方式进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="代理联系方式">
                    {getFieldDecorator('agentPhone', {})(
                      <Input placeholder="请输入代理联系方式进行搜索" className={styles.input} />
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
              </Col>
              <Table
                className={styles.table}
                pagination={{
                  defaultCurrent: 1,
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: pageChange,
                }}
                loading={this.state.loading}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={columns}
              />
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.pane}>
            <Row type="flex" justify="start">
              <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                <ChartCard
                  className={styles.card}
                  title="订单总收益（元）"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{ __html: yuan(this.state.details.orderPriceSum) }}
                    />
                  )}
                />
                <ChartCard
                  className={styles.card}
                  title="订单总量"
                  total={this.state.details.orderCountSum || 0}
                />
                <ChartCard
                  className={styles.card}
                  title="昨日订单总额（元）"
                  total={() => (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: yuan(this.state.details.yesterdayOrderPriceSum),
                      }}
                    />
                  )}
                />
                <ChartCard
                  className={styles.card}
                  title="昨日订单总量"
                  total={this.state.details.yesterdayOrderCount || 0}
                />
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                商户编号 :{' '}
                {this.state.details.id ? '6100' + this.idSlice(this.state.details.id, 4) : ''}
              </Col>
              <Col className={styles.right}>商户名称 : {this.state.details.name}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                商户状态 :{' '}
                {this.state.details.state === 0
                  ? '已关联'
                  : this.state.details.state === 1
                  ? '未关联'
                  : '删除'}
              </Col>
              <Col className={styles.right}>
                分润比例 : {(this.state.details.reward || 0) + '%'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>联系人 : {this.state.details.linkman}</Col>
              <Col className={styles.right}>联系方式 : {this.state.details.linktel}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                上级代理 : {this.state.details.parentAgentName || '无'}
              </Col>
              <Col className={styles.right}>
                上级代理联系方式 : {this.state.details.parentAgentPhone || '无'}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>营业时间 : {this.state.details.openTime}</Col>
              <Col className={styles.right}>人均消费 : {this.state.details.personCost}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>详细地址 : {this.state.details.address}</Col>
              <Col className={styles.right}>
                注册时间 : {moment(this.state.details.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                申请时间 : {moment(this.state.details.applyTime).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
              <Col className={styles.right}>解绑原因 : {this.state.details.info}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row justify="start" type="flex" className={styles.line}>
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </TabPane>
        </Tabs>
        <Modal
          title="提现审核"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          className={styles.modal}
        >
          <Form>
            <Form.Item label="审核情况">
              {getFieldDecorator('radio-group')(
                <Radio.Group onChange={this.onRadioChange}>
                  <Radio value={0}>审核通过</Radio>
                  <Radio value={-1}>审核不通过</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {this.state.radio === -1 ? (
              <Form.Item label="原因">
                {getFieldDecorator('result', {})(<Input.TextArea rows={4} />)}
              </Form.Item>
            ) : (
              ''
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ApplyFor;
