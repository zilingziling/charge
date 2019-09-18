import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/returnEquip/components/search';
const Column = Table.Column;

const ReturnEquip = () => {
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
        <Column title="仓库名称" />
        <Column title="设备编号" />
        <Column title="设备类型" />
        <Column title="设备供应商" />
        <Column title="是否良品" />
        <Column title="退回方式" />
        <Column title="退回方" />
        <Column title="联系方式" />
        <Column title="时间" />
      </Table>
    </div>
  );
};

export default ReturnEquip;
