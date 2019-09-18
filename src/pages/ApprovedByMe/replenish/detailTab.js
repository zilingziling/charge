import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import SearchDetail from '@/pages/ApprovedByMe/replenish/components/searchDetail';
const Column = Table.Column;
const DetailTab = () => {
  return (
    <div className={styles.contentWrapper}>
      <SearchDetail />
      <Table
        bordered
        dataSource={[]}
        rowKey="roleId"
        // pagination={pager}
        // onChange={handleTableChange}
        // loading={loading}
      >
        <Column title="设备编号" />
        <Column title="设备类型" />
        <Column title="设备供应商" />
      </Table>
    </div>
  );
};

export default DetailTab;
