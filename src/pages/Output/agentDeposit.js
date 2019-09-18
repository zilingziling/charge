import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card } from 'antd';
import styles from '@/pages/mylayout.less';
const FormItem = Form.Item;
const { Column } = Table;
const columns = [
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: () => <a href="javascript:;">查看押金记录</a>,
  },
  { title: '总代理名称', dataIndex: 'dentis', key: 'type' },
  { title: '联系方式', dataIndex: 'status', key: 'status' },
  { title: '已缴纳押金金额', dataIndex: 'mobile', key: 'phone' },
  { title: '已扣除押金总金额', dataIndex: 'rentTimeCount', key: 'rentTimes' },
  { title: '剩余押金总额', dataIndex: 'outTimeCount', key: 'overtime' },
  { title: '最后一次缴纳时间', dataIndex: 'totalMoney', key: 'totalMoney' },
];
const data = [
  {
    id: 1,
    type: '支付宝',
    status: '启用',
    phone: '123456789',
    rentTimes: '10',
    overtime: '1',
    totalMoney: '20',
    registerTime: '2019/1/2',
  },
];
@Form.create()
class AgentDeposit extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="联系方式">
                {getFieldDecorator('phone')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <Button icon="search" type="primary">
                搜索
              </Button>
            </Form>
          </Card>
        </div>
        <Table bordered dataSource={data} columns={columns} rowKey="id" />
      </div>
    );
  }
}

export default AgentDeposit;
