import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form, Select, Tabs } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import { ChartCard, yuan } from 'ant-design-pro/lib/Charts';

const Option = Select.Option;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.order,
}))
@Form.create()
class Record extends Component {
  componentDidMount() {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'list/fetch',
    //   payload: {
    //     condition: {type: 1},
    //     desc: true,
    //     nowPage: 1,
    //     orderCondition: [],
    //     pageSize: 10
    //   },
    // });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const order = fieldsValue['order'];
      const agency = fieldsValue['agency'];
      const type = fieldsValue['type'];
      const values = {
        ...fieldsValue,
        type: type,
        agency: agency,
        order: order,
      };
      console.log('Received values of form: ', values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const dataSource = [
      {
        operation: '胡彦斌',
        id: 32,
        payType: '西湖区湖底公园1号',
      },
    ];
    // const dataSource = this.props.list.list;
    // console.log(dataSource);

    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '状态',
        dataIndex: 'payType',
        key: 'payType',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: '用户手机号',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: '提现金额（元）',
        dataIndex: 'userlinkTel',
        key: 'userlinkTel',
      },
      {
        title: '手续费（元）',
        dataIndex: 'rentPrice',
        key: 'rentPrice',
      },
      {
        title: '到账金额（元）',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '开户行',
        dataIndex: 'rentTime',
        key: '5',
      },
      {
        title: '银行卡号',
        dataIndex: 'rentTime',
        key: '4',
      },
      {
        title: '持卡人',
        dataIndex: 'rentTime',
        key: '3',
      },
      {
        title: '预留手机号',
        dataIndex: 'rentTime',
        key: '2',
      },
      {
        title: '申请日期',
        dataIndex: 'rentTime',
        key: '1',
      },
      {
        title: '处理日期',
        dataIndex: 'rentTime',
        key: '0',
      },
    ];

    return (
      <div className={styles.bgc}>
        <Row>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form}>
                {getFieldDecorator('order', {})(
                  <Input placeholder="请输入用户手机号进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form}>
                {getFieldDecorator('agency', {})(
                  <Input placeholder="请输入银行卡号进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form}>
                {getFieldDecorator('type', {})(
                  <Select style={{ width: 120 }}>
                    <Option value="0">全部</Option>
                    <Option value="2">处理中</Option>
                    <Option value="1">已到账</Option>
                    <Option value="-1">未通过</Option>
                  </Select>
                )}
              </Form.Item>
            </Form>
            <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
              搜索
            </Button>
          </Col>
          <Table bordered scroll={{ x: 1000 }} dataSource={dataSource} columns={columns} />
        </Row>
      </div>
    );
  }
}

export default Record;
