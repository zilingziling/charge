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
import { log } from 'lodash-decorators/utils';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

@connect(({ relationShip, loading }) => ({
  relationShip,
  loading: loading.models.relationShip,
}))
@Form.create()
class EmpAndStore extends Component {
  state = {
    expand: false,
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    storeCurrent: 1,
    storePageSize: 10,
    storeTotal: 0,
    BdId: '',
    loading: false,
    employeeName: '',
    employeePhone: '',
  };

  getEmployee(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/employee',
      payload: {
        employeeName: z.state.employeeName,
        employeePhone: z.state.employeePhone,
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

  getEmployeeStore(page) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/employeeStore',
      payload: {
        BdId: this.state.BdId,
        page: page,
        per_page: this.state.storePageSize,
      },
      callback: function(res) {
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
        z.getEmployee(z.state.current);
      },
    });
  };

  componentDidMount() {
    this.getEmployee(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const employeeName = fieldsValue['employeeName'];
      const employeePhone = fieldsValue['employeePhone'];
      this.setState(
        {
          employeeName: employeeName,
          employeePhone: employeePhone,
        },
        () => {
          this.getEmployee(1);
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
        this.getEmployee(1);
      },
    );
  };

  details = (text, record) => {
    this.setState({
      BdId: record.agentUserId,
    }, () => {
      this.getEmployeeStore(1);
      this.setState({ activeKey: '2' });
    });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
  };

  changeBind = (text, record) => {
    this.employeeBind(record.storeId);
  };

  unBind = (text, record) => {
    this.employeeBind(record.storeId);
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

  employeeBind(storeId) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/employeeBind',
      payload: {
        storeDto: {
          phone: 'string',
          storeId: storeId,
          storeName: 'string',
        },
      },
      callback: function(res) {
        if (res.data) {
          if (res.code === '000000') {
            message.success(res.msg);
          } else {
            message.error(res.msg);
          }
          z.getEmployeeStore(z.state.storeCurrent);
        }
      },
    });
  }

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.relationShip.employee ? this.props.relationShip.employee.list : [];
    const storeList = this.props.relationShip.employeeStore ? this.props.relationShip.employeeStore.list : [];

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
      },
      {
        title: '员工ID',
        dataIndex: 'agentUserId',
        key: 'agentUserId',
      },
      {
        title: '员工名称',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '员工联系方式',
        dataIndex: 'employeePhone',
        key: 'employeePhone',
      },
    ];

    const columns2 = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.changeBind(text, record)}>
              解除绑定
            </a>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={() => this.unBind(text, record)}>
              更换绑定
            </a>
          </span>
        ),
      },
      {
        title: '状态',//门店状态 1是待签约 2是待部署 4是已部署
        dataIndex: 'state',
        key: 'state',
        render: key => <span>{key === 1 ? '待签约' : key === 2 ? '待部署' : '已部署'}</span>,
      },
      {
        title: '门店ID',
        dataIndex: 'storeId',
        key: 'storeId',
      },
      {
        title: '等级',
        dataIndex: 'storeLevel',
        key: 'storeLevel',
      },
      {
        title: '门店名称',
        dataIndex: 'storeName',
        key: 'storeName',
      },
      {
        title: '所在地区',
        dataIndex: 'storeArea',
        key: 'storeArea',
      },
      {
        title: '门店品类',
        dataIndex: 'storeType',
        key: 'storeType',
      },
      {
        title: '是否连锁',
        dataIndex: 'storeChain',
        key: 'storeChain',
        render: key => <span>{key === 1 ? '连锁' : '没有连锁'}</span>,
      },
      {
        title: '门店负责人',
        dataIndex: 'storePerson',
        key: 'storePerson',
      },
      {
        title: '门店联系方式',
        dataIndex: 'storePhone',
        key: 'storePhone',
      },
      {
        title: '商户名称',
        dataIndex: 'businessName',
        key: 'businessName',
      },
      {
        title: '商户联系方式',
        dataIndex: 'businessPhone',
        key: 'businessPhone',
      },
      {
        title: '分成状态',//是否参与分成 1是参与分成 2是未参与分成
        dataIndex: 'shareStatus',
        key: 'shareStatus',
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
      z.getEmployee(page);
    }

    function storePageChange(page, pageSize) {
      console.log(page, pageSize);
      z.getEmployeeStore(page);
    }

    function onShowSizeChange(current, pageSize) {
      z.setState(
        {
          storeCurrent: current,
          storePageSize: pageSize,
        },
        () => {
          z.getEmployee(1);
        },
      );
    }

    function storeSizeChange(current, pageSize) {
      z.setState(
        {
          current: current,
          pageSize: pageSize,
        },
        () => {
          z.getEmployee(1);
        },
      );
    }

    return (
      <div className={styles.bgc}>
        <Tabs activeKey={this.state.activeKey} onChange={this.callback}>
          <TabPane tab="员工管理" key="1" className={styles.pane}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={'员工名称'}>
                    {getFieldDecorator('employeeName', {
                      rules: [{}],
                    })(<Input placeholder="请输入员工名称进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'员工联系方式'}>
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
              rowKey="agentUserId"
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
                  <Form.Item label={'商户名称'}>
                    {getFieldDecorator('businessName', {})(<Input placeholder="请输入商户名称进行搜索"/>)}
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
              dataSource={storeList}
              columns={columns2}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EmpAndStore;
