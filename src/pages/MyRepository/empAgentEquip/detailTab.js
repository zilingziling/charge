import React from 'react';
import styles from '@/pages/mylayout.less';
import { Table, Tabs } from 'antd';
import SearchD from '@/pages/MyRepository/empAgentEquip/components/searchD';
const Column = Table.Column;

const DetailTab = () => {
  return (
    <div className={styles.contentWrapper}>
      <SearchD />
      <Table
        bordered
        dataSource={[]}
        // pagination={pager}
        // onChange={handleTableChange}
        // loading={loading}
      >
        <Column title="仓库名称" />
        <Column title="设备编号" />
        <Column title="设备类型" />
        <Column title="设备供应商" />
        <Column title="类型" />
        <Column title="时间" />
      </Table>
    </div>
  );
};
export default DetailTab;
