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
class ShopAndStore extends Component {
  state = {
    expand: false,
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    storeCurrent: 1,
    storePageSize: 10,
    storeTotal: 0,
    loading: false,
    businessId: '',
    shopSearch: {
      businessname: '',
      startTime: '',
      endTime: '',
      mobile: '',
      subjectname: '',
    },

  };

  getShopList(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/shopList',
      payload: {
        businessname: z.state.shopSearch.businessname,
        startTime: z.state.shopSearch.startTime,
        endTime: z.state.shopSearch.endTime,
        mobile: z.state.shopSearch.mobile,
        subjectname: z.state.shopSearch.subjectname,
        page: page,
        per_page: z.state.pageSize,
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          console.log(res);
          z.setState({
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
        }
      },
    });
  }

  getStoreList(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/shopStoreList',
      payload: {
        businessId: z.state.businessId,
        page: page,
        per_page: z.state.pageSize,
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            storeCurrent: res.data.pageIndex,
            storePageSize: res.data.pageSize,
            storeTotal: res.data.total,
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
        z.getShopList(z.state.current);
      },
    });
  };

  componentDidMount() {
    this.getShopList(1);
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
          this.getShopList(1);
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
        this.getShopList(1);
      },
    );
  };

  details = (text, record) => {
    this.setState({
      businessId: record.businessId,
    }, () => {
      this.getStoreList(1);
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

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.relationShip.shopList ? this.props.relationShip.shopList.list : [];
    const dataSource2 = this.props.relationShip.shopStoreList ? this.props.relationShip.shopStoreList.list : [];
    console.log(dataSource);

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              门店
            </a>
          </span>
        ),
      }, {
        title: '商户ID',
        dataIndex: 'businessId',
        key: 'businessId',
      }, {
        title: '商户名称',
        dataIndex: 'businessName',
        key: 'businessName',
      }, {
        title: '主体名称',
        dataIndex: 'subjectName',
        key: 'subjectName',
      }, {
        title: '主体类型',
        dataIndex: 'licenseType',
        key: 'licenseType',
      }, {
        title: '认证状态',
        dataIndex: 'certification',
        key: 'certification',
      }, {
        title: '绑定手机号码',
        dataIndex: 'businessPhone',
        key: 'businessPhone',
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        // render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      }];

    const shop = [
      {
        title: '操作',
        key: 'operation',
        dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.unlink(text, record)}>
              解除绑定
            </a>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={() => this.unlink(text, record)}>
              更换绑定
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
        title: '分成状态',
        key: 'shareStatus',
        dataIndex: 'shareStatus',
        render: key => <span>{key === '1' ? '参与分成' : '未参与分成'}</span>,
      },
    ];

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
      z.getShopList(page);
    }

    function storePageChange(page, pageSize) {
      z.getStoreList(page);
    }

    function onShowSizeChange(current, pageSize) {
      z.setState(
        {
          current: current,
          pageSize: pageSize,
        },
        () => {
          z.getShopList(1);
        },
      );
    }

    function storeSizeChange(current, pageSize) {
      z.setState(
        {
          storeCurrent: current,
          storePageSize: pageSize,
        },
        () => {
          z.getStoreList(1);
        },
      );
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="商户管理" key="1" className={styles.pane}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={'商户联系方式'}>
                    {getFieldDecorator('employeeName', {
                      rules: [{}],
                    })(<Input placeholder="请输入员工名称进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'商户名称'}>
                    {getFieldDecorator('employeePhone', {
                      rules: [{}],
                    })(<Input placeholder="请输入员工联系方式进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'主体名称'}>
                    {getFieldDecorator('employeePhone', {
                      rules: [{}],
                    })(<Input placeholder="请输入员工联系方式进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
                  <Form.Item label={'创建时间'}>
                    {getFieldDecorator('employeePhone', {
                      rules: [{}],
                    })(<Input placeholder="请输入员工联系方式进行搜索"/>)}
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
              rowKey="businessId"
              bordered
              scroll={{ x: 1000 }}
              dataSource={dataSource}
              columns={columns}
            />
          </TabPane>
          <TabPane tab="门店列表" disabled key="2" className={styles.pane}>
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
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: storeSizeChange,
                defaultCurrent: 1,
                current: this.state.storeCurrent,
                pageSize: this.state.storePageSize,
                total: this.state.storeTotal,
                onChange: storePageChange,
                showTotal: () => {
                  return (
                    <div className={selfStyle.total}>
                      <p>共计：{this.state.storeTotal} 条</p>
                    </div>
                  );
                },
              }}
              rowKey="id"
              bordered
              scroll={{ x: 1000 }}
              dataSource={dataSource2}
              columns={shop}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ShopAndStore;
