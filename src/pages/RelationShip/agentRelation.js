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
class AgentRelation extends Component {
  state = {
    expand: false,
    details: {},
    level: {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
    },
    activeKey: '1',
    current: 1,
    pageSize: 10,
    total: 0,
    storeCurrent: 1,
    storePageSize: 10,
    storeTotal: 0,
    agentName: '',
    channelName: '',
    parentName: '',
    agentLevel: '',
    loading: false,
    agentId: '',
    shopList: [],
  };

  getAgentRelation(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/agentRelation',
      payload: {
        agentName: this.state.orderId,
        channelName: this.state.staTime,
        parentName: this.state.endTime,
        agentLevel: this.state.agentLevel,
        page: page,
        order: 'DESC',
        per_page: this.state.pageSize,
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

  getAgentRelationDetails(id) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/agentDetails',
      payload: { agentId: id },
      callback: function(res) {
        if (res.data) {
          z.setState({
            details: res.data,
          });
        }
      },
    });
  }

  getStoreList(page) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/storeList',
      payload: {
        page: page,
        order: 'DESC',
        per_page: this.state.storePageSize,
        agentId: z.state.agentId,
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

  upRelation = e => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/relation',
      payload: {
        agentId: z.state.agentId,
        state: '2',
      },
      callback: function(res) {
        if (res.code === '000000') {
          z.createRelationship(res.data);
        }
      },
    });
  };

  downRelation = e => {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'relationShip/relation',
      payload: {
        agentId: z.state.agentId,
        state: '1',
      },
      callback: function(res) {
        if (res.code === '000000') {
          z.createRelationship(res.data);
        }
      },
    });
  };

  createRelationship(list) {
    let channel = [];
    let level1 = [];
    let level2 = [];
    let level3 = [];
    let level4 = [];
    list.forEach(item => {
      switch (item.agentLevel) {
        case 1:
          level1.push(item);
          break;
        case 2:
          level2.push(item);
          break;
        case 3:
          level3.push(item);
          break;
        case 4:
          level4.push(item);
          break;
        default:
          channel.push(item);
          break;
      }
    });
    console.log(level4, level3, level2, level1, channel);
    this.setState({
      level: {
        level1: level1,
        level2: level2,
        level3: level3,
        level4: level4,
      },
    });
  }

  unlink = record => {
    let z = this;
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'relationShip/scrapOrder',
    //   payload: {
    //     id: record.id,
    //   },
    //   callback: function(res) {
    //     if (res.code === '000000') {
    //       message.success(res.msg);
    //     } else {
    //       message.error(res.msg);
    //     }
    //     z.getAgentRelation(z.state.current);
    //   },
    // });
  };

  componentDidMount() {
    this.getAgentRelation(1);
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
          this.getAgentRelation(1);
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
        this.getAgentRelation(1);
      },
    );
  };

  details = (text, record) => {
    this.setState({
      details: {},
      level: {
        level1: [],
        level2: [],
        level3: [],
        level4: [],
      },
    }, () => {
      this.getAgentRelationDetails(record.agentId);
      this.setState({ activeKey: '2', agentId: record.agentId });
    });
  };

  shop = (text, record) => {
    this.setState({
      shopList: [],
      agentId: record.agentId,
    }, () => {
      this.getStoreList(1);
      this.setState({ activeKey: '3' });
    });
  };

  list = () => {
    this.setState({ activeKey: '1' });
  };

  callback = key => {
    this.setState({ activeKey: key });
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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
    const dataSource = this.props.relationShip.agentRelation ? this.props.relationShip.agentRelation.list : [];
    const history = [];
    const shopList = this.props.relationShip.store ? this.props.relationShip.store.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.details(text, record)}>
              详情
            </a>
            <Divider type="vertical"/>
            <a href="javascript:;" onClick={() => this.shop(text, record)}>
              门店
            </a>
            <Divider type="vertical"/>
            <Popconfirm
              title={`是否要解除${record.agentName}的关联？`}
              onConfirm={() => this.unlink(record)}
            >
              <a href="javascript:;">解除关联</a>
            </Popconfirm>
          </span>
        ),
      },
      {
        title: '代理ID',
        dataIndex: 'agentId',
        key: 'agentId',
      },
      {
        title: '代理名称',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '代理等级',
        dataIndex: 'agentLevel',
        key: 'agentLevel',
      },
      {
        title: '代理联系方式',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '分润比例',
        dataIndex: 'agentReward',
        key: 'agentReward',
      },
      {
        title: '上级名称',
        dataIndex: 'parentAgentName',
        key: 'parentAgentName',
      },
      {
        title: '上级联系方式',
        dataIndex: 'parentAgentPhone',
        key: 'parentAgentPhone',
      },
    ];

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

    const bindingRecord = [
      {
        title: '时间',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '动作',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '操作人',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '操作人联系方式',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '上级名称',
        dataIndex: 'advancePay',
        key: 'advancePay',
      },
      {
        title: '上级联系方式',
        dataIndex: 'details',
        key: 'details',
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
      z.getAgentRelation(page);
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
          z.getAgentRelation(1);
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
          <TabPane tab="代理管理" key="1" className={styles.pane}>
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch} style={{ marginBottom: 20 }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label={'代理名称'}>
                    {getFieldDecorator('agentName', {})(<Input placeholder="请输入员工名称进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'渠道经理'}>
                    {getFieldDecorator('channelName', {})(<Input placeholder="请输入员工联系方式进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label={'上级名称'}>
                    {getFieldDecorator('parentName', {})(<Input placeholder="请输入员工联系方式进行搜索"/>)}
                  </Form.Item>
                </Col>
                <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
                  <Form.Item label={'代理等级'}>
                    {getFieldDecorator('agentLevel', {})(<Input placeholder="请输入员工联系方式进行搜索"/>)}
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
              rowKey="agentId"
              bordered
              scroll={{ x: 1000 }}
              dataSource={dataSource}
              columns={columns}
            />
          </TabPane>
          <TabPane tab="代理详情" key="2" disabled className={styles.pane}>
            <Row className={styles.title}>代理信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>代理ID : {this.state.details.agentId}</Col>
              <Col className={styles.right}>代理名称 : {this.state.details.agentName}</Col>
              <Col className={styles.right}>企业名称 : {this.state.details.companyName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>代理等级 : {this.state.details.agentLevel}</Col>
              <Col className={styles.right}>
                代理联系方式 : {this.state.details.agentPhone}
              </Col>
              <Col className={styles.right}>分润比例 : {this.state.details.agentReward}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }}/>
            <Row className={styles.title}>上级信息</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>代理ID : {this.state.details.parentAgentId}</Col>
              <Col className={styles.right}>代理名称 : {this.state.details.parentName}</Col>
              <Col className={styles.right}>企业名称 : {this.state.details.parentCompanyName}</Col>
            </Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>代理等级 : {this.state.details.parentLevel}</Col>
              <Col className={styles.right}>
                代理联系方式 : {this.state.details.parentPhone}
              </Col>
              <Col className={styles.right}>分润比例 : {this.state.details.parentAgentReward}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }}/>
            <Row className={styles.title}>历史绑定记录</Row>
            <Row justify="start" type="flex" className={styles.line}>
              <Table
                className={styles.table}
                pagination={{
                  defaultCurrent: 1,
                  current: this.state.current,
                  pageSize: this.state.pageSize,
                  total: this.state.total,
                  onChange: pageChange,
                }}
                rowKey="id"
                bordered
                scroll={{ x: 1000 }}
                dataSource={history}
                columns={bindingRecord}
              />
            </Row>
            <Divider style={{ marginBottom: 32 }}/>
            <Row className={styles.title}>代理关系
              <Button type="primary" className={styles.classBtn} onClick={this.upRelation}>上级</Button>
              <Button type="primary" className={styles.classBtn} onClick={this.downRelation}>下级</Button>
            </Row>
            {this.state.level.level1.length > 0 ? <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>总代理 : {this.state.level.level1.map(item => {
                return item.agentName;
              })}</Col>
            </Row> : ''}
            {this.state.level.level2.length > 0 ? <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>一级代理 : {this.state.level.level2.map(item => {
                return item.agentName;
              })}</Col>
            </Row> : ''}
            {this.state.level.level3.length > 0 ? <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>二级代理 : {this.state.level.level3.map(item => {
                return item.agentName;
              })}</Col>
            </Row> : ''}
            {this.state.level.level4.length > 0 ? <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>三级代理 : {this.state.level.level4.map(item => {
                return item.agentName;
              })}</Col>
            </Row> : ''}

            <Row justify="start" type="flex" className={styles.line}>
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </TabPane>
          <TabPane tab="门店列表" disabled key="3" className={styles.pane}>
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
              rowKey="storeId"
              bordered
              scroll={{ x: 1000 }}
              dataSource={shopList}
              columns={shop}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AgentRelation;
