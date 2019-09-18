import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Divider,
  Tabs,
  Form,
  message,
  Modal,
  Radio,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from '@/pages/order/global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ purchase, loading }) => ({
  purchase,
  loading: loading.models.purchase,
}))
@Form.create()
class Record extends Component {
  state = {
    details: {},
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    agentContact: '',
    staTime: '',
    endTime: '',
    loading: false,
    big: '',
    small: '',
  };

  getPurchase(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'purchase/record',
      payload: {
        condition: {
          agentContact: this.state.agentContact,
          startApplyTime: this.state.staTime,
          endApplyTime: this.state.endTime,
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
      type: 'purchase/recordDetails',
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

  putRecord(big, small) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'purchase/putRecord',
      payload: { id: this.state.id, deviceBigDelivery: big, deviceSmallDelivery: small },
      callback: function(res) {
        z.setState({
          confirmLoading: false,
        });
        if (res.code === '000000') {
          z.setState({
            visible: false,
          });
          message.success(res.msg);
          z.getPurchase(1);
        } else {
          message.error(res.msg);
        }
      },
    });
  }

  showModal = (text, record) => {
    this.props.form.setFieldsValue({
      big: record.deviceBigDelivery,
      small: record.deviceSmallDelivery,
    });
    this.setState(
      {
        id: record.id,
        big: record.deviceBigDelivery,
        small: record.deviceSmallDelivery,
      },
      () => {
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
    this.props.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const big = value['big'];
      const small = value['small'];
      this.putRecord(big, small);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    this.getPurchase(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const rangeValue = fieldsValue['range-picker'];
      const orderId = fieldsValue['orderId'];
      this.setState(
        {
          agentContact: orderId,
          staTime: rangeValue ? (rangeValue[0] ? rangeValue[0].format('YYYY-MM-DD') : '') : '',
          endTime: rangeValue ? (rangeValue[1] ? rangeValue[1].format('YYYY-MM-DD') : '') : '',
        },
        () => {
          this.getPurchase(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        agentContact: '',
        staTime: '',
        endTime: '',
      },
      () => {
        this.getPurchase(1);
      }
    );
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

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.purchase.record ? this.props.purchase.record.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
          <span>
            <a
              href="javascript:;"
              className={styles.red}
              onClick={() => this.showModal(text, record)}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
          </span>
        ),
      },
      {
        title: '采购批次',
        dataIndex: 'batch',
        key: 'batch',
      },
      {
        title: '总代理',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '联系方式',
        dataIndex: 'agentContact',
        key: 'agentContact',
      },
      {
        title: '收件人',
        dataIndex: 'receiptName',
        key: 'receiptName',
      },
      {
        title: '收件人联系方式',
        dataIndex: 'receiptMobile',
        key: 'receiptMobile',
      },
      {
        title: '付款方式',
        dataIndex: 'payment',
        key: 'payment',
        render: key => <span>{key === 0 ? '分期付款' : '一次性付款'}</span>,
      },
      {
        title: '6口5台数量',
        dataIndex: 'deviceSmallcount',
        key: 'deviceSmallcount',
      },
      {
        title: '6口5台已发货数量',
        dataIndex: 'deviceSmallDelivery',
        key: 'deviceSmallDelivery',
      },
      {
        title: '12口11台数量',
        dataIndex: 'deviceBigcount',
        key: 'deviceBigcount',
      },
      {
        title: '12口11台已发货数量',
        dataIndex: 'deviceBigDelivery',
        key: 'deviceBigDelivery',
      },
      {
        title: '收货地址',
        dataIndex: 'receiptAddress',
        key: 'receiptAddress',
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
    ];

    function onChange(date, dateString) {
      console.log(date, dateString);
    }

    function pageChange(page, pageSize) {
      console.log(page, pageSize);
      z.getPurchase(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="列表页" key="1" className={styles.pane}>
            <Row>
              <Col className={styles.col}>
                <Form className={styles.form}>
                  <Form.Item className={styles.form} label="代理联系方式">
                    {getFieldDecorator('orderId', {})(
                      <Input placeholder="请输入代理联系方式进行搜索" className={styles.input} />
                    )}
                  </Form.Item>
                  <Form.Item className={styles.form} label="申请时间">
                    {getFieldDecorator('range-picker', {})(<RangePicker onChange={onChange} />)}
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
                <Button
                  icon="reload"
                  type="primary"
                  onClick={this.handleClearSearch}
                  className={styles.btn}
                >
                  重置
                </Button>
              </Col>
              <Table
                loading={this.state.loading}
                className={styles.table}
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
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={dataSource}
                columns={columns}
              />
            </Row>
          </TabPane>
          <TabPane tab="详情页" key="2" className={styles.pane}>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>采购批次 : {this.state.details.batch}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>总代理 : {this.state.details.agentName}</Col>
              <Col className={styles.right}>联系方式 : {this.state.details.agentContact}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>收件人 : {this.state.details.receiptName}</Col>
              <Col className={styles.right}>
                收件人联系方式 : {this.state.details.receiptMobile}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>6口5台数量 : {this.state.details.deviceSmallcount}</Col>
              <Col className={styles.right}>12口11台数量 : {this.state.details.deviceBigcount}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                6口5台已发货数量 : {this.state.details.deviceSmallDelivery}
              </Col>
              <Col className={styles.right}>
                12口11台已发货数量 : {this.state.details.deviceBigDelivery}
              </Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>付款方式 : {this.state.details.payment}</Col>
              {/*<Col className={styles.right}>申请时间 : {this.state.details.applyTime}</Col>*/}
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>收货地址 : {this.state.details.receiptAddress}</Col>
            </Row>
            {/*<Row justify="start" type="flex" className={styles.line}>*/}
            {/*  <Col className={styles.left}>备注 : {this.state.details.details}</Col>*/}
            {/*</Row>*/}

            <Divider style={{ marginBottom: 32 }} />
            <Row justify="start" type="flex" className={styles.line}>
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </TabPane>
        </Tabs>
        <Modal
          title="编辑采购单"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          className={styles.modal}
        >
          <Form>
            <Form.Item label="6口5台已发货数量">
              {getFieldDecorator('small', { initialValue: this.state.small })(
                <Input type="number" />
              )}
            </Form.Item>
            <Form.Item label="12口11台已发货数量">
              {getFieldDecorator('big', { initialValue: this.state.big })(<Input type="number" />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Record;
