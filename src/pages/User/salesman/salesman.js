import React, { Component } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table } from 'antd';
import Search from '@/pages/User/salesman/components/search';
const { Column } = Table;
const Salesman = () => {
  return (
    <div className={styles.contentWrapper}>
      <Search />
      <Table
        // dataSource={list}
        rowKey="id"
        // pagination={pager}
        // onChange={this.handleTableChange}
        // loading={this.props.loading}
      >
        <Column title="BD ID" dataIndex="tags" />
        <Column title="BD 姓名" dataIndex="tags" />
        <Column title="BD 电话" dataIndex="tags" />
        <Column title="所在地区" dataIndex="tags" />
        <Column title="门店总量" dataIndex="tags" />
        <Column title="商户总量" dataIndex="tags" />
        <Column title="剩余申领容量" dataIndex="tags" />
        <Column title="剩余最大容量" dataIndex="tags" />
        <Column title="上月业绩" dataIndex="tags" />
        <Column title="本月业绩" dataIndex="tags" />
      </Table>
    </div>
  );
};
export default Salesman;
