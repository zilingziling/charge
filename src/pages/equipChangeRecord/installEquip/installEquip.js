import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/installEquip/components/search';
const Column = Table.Column;

const InstallEquip = () => {
  return (
    <div className={styles.contentWrapper}>
      <Search />
      <Table
        bordered
        dataSource={[]}
        rowKey="roleId"

        // pagination={pager}
        // onChange={handleTableChange}
        // loading={loading}
      >
        <Column title="设备编号" />
        <Column title="门店名称" />
        <Column title="所属地区" />
        <Column title="详细地址" />
        <Column title="商户名称" />
        <Column title="部署人" />
        <Column title="部署人联系方式" />
        <Column title="部署时间" />
      </Table>
    </div>
  );
};

export default InstallEquip;
