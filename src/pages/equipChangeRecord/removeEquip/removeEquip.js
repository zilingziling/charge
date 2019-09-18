import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/removeEquip/components/search';
const Column = Table.Column;

const RemoveEquip = () => {
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
        <Column title="设备编号" />
        <Column title="设备类型" />
        <Column title="设备供应商" />
        <Column title="入库时间" />
        <Column title="设备状态" />
        <Column title="移除原因" />
      </Table>
    </div>
  );
};

export default RemoveEquip;
