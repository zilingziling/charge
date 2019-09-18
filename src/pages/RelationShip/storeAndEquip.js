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
  Popconfirm,
  Cascader,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
import moment from 'moment';
import Icon from '@alifd/next/lib/icon';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ relationShip, loading }) => ({
  relationShip,
  loading: loading.models.relationShip,
}))
@Form.create()
class StoreAndEquip extends Component {
  state = {
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    deviceCurrent: 1,
    devicePageSize: 10,
    deviceTotal: 0,
    loading: false,
    storeId: '',
  };

  storeManage(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/storeManage',
      payload: {
        page: page,
        per_page: z.state.pageSize,
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

  storeDevice(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/storeDevice',
      payload: {
        storeId: z.state.storeId,
        page: page,
        per_page: z.state.pageSize,
      },
      callback: function(res) {
        console.log(res);
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            deviceCurrent: res.data.pageIndex,
            devicePageSize: res.data.pageSize,
            deviceTotal: res.data.total,
          });
        }
      },
    });
  }

  scrapOrder = record => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'order/scrapOrder',
      payload: {
        id: record.id,
      },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.storeManage(z.state.current);
      },
    });
  };

  componentDidMount() {
    this.storeManage(1);
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
          orderId: orderId,
          staTime: rangeValue ? (rangeValue[0] ? rangeValue[0].format('YYYY-MM-DD') : '') : '',
          endTime: rangeValue ? (rangeValue[1] ? rangeValue[1].format('YYYY-MM-DD') : '') : '',
        },
        () => {
          this.storeManage(1);
        },
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        orderId: '',
        staTime: '',
        endTime: '',
      },
      () => {
        this.storeManage(1);
      },
    );
  };

  details = (text, record) => {
    this.setState({
      storeId: record.storeId,
    }, () => {
      this.storeDevice(1);
      this.setState({ activeKey: '2' });
    });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
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
    const dataSource = this.props.relationShip.storeManage ? this.props.relationShip.storeManage.list : [];
    const dataSource2 = this.props.relationShip.device ? this.props.relationShip.device.list : [];
    console.log(this.props.relationShip);

    const shop = [
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              查看设备
            </a>
          </span>
        ),
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render: key => <span>{key === 1 ? '待签约' : key === 2 ? '待部署' : '已部署'}</span>,
      },
      {
        title: '门店ID',
        key: 'storeId',
        dataIndex: 'storeId',
      },
      {
        title: '等级',
        key: 'storeLevel',
        dataIndex: 'storeLevel',
      },
      {
        title: '门店名称',
        key: 'storeName',
        dataIndex: 'storeName',
      },
      {
        title: '所在地区',
        key: 'storeArea',
        dataIndex: 'storeArea',
      },
      {
        title: '门店品类',
        key: 'storeType',
        dataIndex: 'storeType',
      },
      {
        title: '是否连锁',
        key: 'storeChain',
        dataIndex: 'storeChain',
        render: key => <span>{key === 1 ? '连锁' : '没有连锁'}</span>,
      },
      {
        title: '门店负责人',
        key: 'storePerson',
        dataIndex: 'storePerson',
      },
      {
        title: '门店联系方式',
        key: 'storePhone',
        dataIndex: 'storePhone',
      },
      {
        title: '商户名称',
        key: 'businessName',
        dataIndex: 'businessName',
      },
      {
        title: '商户联系方式',
        key: 'businessPhone',
        dataIndex: 'businessPhone',
      },
      {
        title: '分成状态',
        key: 'shareStatus',
        dataIndex: 'shareStatus',
        render: key => <span>{key === '1' ? '参与分成' : '未参与分成'}</span>,
      },
    ];

    const device = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              解除绑定
            </a>
          </span>
        ),
      }, {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
      }, {
        title: '设备编号',
        dataIndex: 'deviceId',
        key: 'deviceId',
      }, {
        title: '部署时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }, {
        title: '部署人',
        dataIndex: 'installMan',
        key: 'installMan',
      }, {
        title: '部署人联系方式',
        dataIndex: 'installPhone',
        key: 'installPhone',
      }, {
        title: '设备厂家',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      }];

    const options = [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];

    function onChange(date, dateString) {
      console.log(date, dateString);
    }

    function pageChange(page, pageSize) {
      console.log(page, pageSize);
      z.storeManage(page);
    }

    function devicePageChange(page, pageSize) {
      console.log(page, pageSize);
      z.storeDevice(page);
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="门店管理" key="1" className={styles.pane}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={'门店名称'}>
                    {getFieldDecorator('storeName', {})(<Input placeholder="请输入门店名称进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'门店品类'}>
                    {getFieldDecorator('type', {})(<Input placeholder="请输入门店品类进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'所在地区'}>
                    {getFieldDecorator('area', {})(<Input placeholder="请输入所在地区进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
                  <Form.Item label={'分成状态'}>
                    {getFieldDecorator('state', {})(<Input placeholder="请输入分成状态进行搜索"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
                    搜索
                  </Button>
                  <Button type="danger" onClick={this.handleClearSearch} className={styles.btn}>
                    重置
                  </Button>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                    更多 <Icon type={this.state.expand ? 'up' : 'down'}/>
                  </a>
                </Col>
              </Row>
            </Form>
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
              rowKey="storeId"
              bordered
              scroll={{ x: 1000 }}
              dataSource={dataSource}
              columns={shop}
            />
          </TabPane>
          <TabPane tab="设备列表" disabled key="2" className={styles.pane}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={'设备类型'}>
                    {getFieldDecorator('storeName', {})(<Input placeholder="请输入门店名称进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'设备编号'}>
                    {getFieldDecorator('type', {})(<Input placeholder="请输入门店品类进行搜索"/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                  <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
                    搜索
                  </Button>
                  <Button type="danger" onClick={this.handleClearSearch} className={styles.btn}>
                    重置
                  </Button>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                    更多 <Icon type={this.state.expand ? 'up' : 'down'}/>
                  </a>
                </Col>
              </Row>
            </Form>
            <Table
              loading={this.state.loading}
              className={styles.table}
              pagination={{
                defaultCurrent: 1,
                current: this.state.deviceCurrent,
                pageSize: this.state.devicePageSize,
                total: this.state.deviceTotal,
                onChange: devicePageChange,
                showTotal: () => {
                  return (
                    <div className={selfStyle.total}>
                      <p>共计：{this.state.deviceTotal} 条</p>
                    </div>
                  );
                },
              }}
              rowKey="deviceId"
              bordered
              scroll={{ x: 1000 }}
              dataSource={dataSource2}
              columns={device}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StoreAndEquip;
