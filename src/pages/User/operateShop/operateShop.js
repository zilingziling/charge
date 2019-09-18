import React, { Component } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table, Tabs } from 'antd';
import Search from '@/pages/User/operateShop/components/search';
const { Column } = Table;
const OperateShop = () => {
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={this.state.activeKey} onChange={this.handleClickTab}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            // dataSource={list}
            rowKey="id"
            // pagination={pager}
            // onChange={this.handleTableChange}
            // loading={this.props.loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => <a href="javascript:;">详情</a>}
            />
            <Column title="商户ID" dataIndex="tags" />
            <Column title="商户名称" dataIndex="tags" />
            <Column title="商户联系方式" dataIndex="tags" />
            <Column title="主体名称" dataIndex="tags" />
            <Column title="主体类型" dataIndex="tags" />
            <Column title="分成比例" dataIndex="tags" />
            <Column title="参与分成门店数" dataIndex="tags" />
            <Column title="未参与分成门店数" dataIndex="tags" />
          </Table>
        </TabPane>
        <TabPane tab="出库" key="2">
          <OutTab onOk={this.handleOutOk} onCancel={this.handleOutCancel} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default OperateShop;
