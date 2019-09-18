import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Divider, Tabs } from 'antd';
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
class Fail extends Component {
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
      type: 'unBundle/fail',
      payload: {
        condition: {
          state: -1,
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

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.unBundle.fall ? this.props.unBundle.fall.list : [];

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
        title: '未通过原因',
        dataIndex: 'datails',
        key: 'datails',
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
                商户编号 : {'6100' + this.idSlice(this.state.details.id, 4)}
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
            <Row justify="start" type="flex" className={styles.line}>
              <Col className={styles.left}>
                处理时间 : {moment(this.state.details.passTime).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
              <Col className={styles.right}>未通过原因 : {this.state.details.notPassDetails}</Col>
            </Row>
            <Divider style={{ marginBottom: 32 }} />
            <Row justify="start" type="flex" className={styles.line}>
              <Button type="primary" icon="double-left" onClick={this.list}>
                返回
              </Button>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Fail;
