import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/changeEquip/components/search';
const Column = Table.Column;

const ChangeEquip = () => {
  const [tabKey, setKey] = useState('1');

  return (
    <div className={styles.contentWrapper}>
      <Search />
      <Table
        dataSource={[]}
        rowKey="roleId"
        bordered
        // pagination={pager}
        // onChange={handleTableChange}
        // loading={loading}
      >
        <Column title="仓库名称" />
        <Column title="原设备编号" />
        <Column title="新设备编号" />
        <Column title="设备类型" />
        <Column title="设备供应商" />
        <Column title="是否良品" />
        <Column title="时间" />
      </Table>
    </div>
  );
};

export default ChangeEquip;
