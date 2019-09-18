import React from 'react';
import { Table } from 'antd';
import styles from '@/pages/mylayout.less';
import DetailSearch from '@/pages/StorageManage/list/components/detailSearch';
const Column = Table.Column;
const DetailTab = () => {
  return (
    <div className={styles.contentWrapper}>
      <DetailSearch />
      <Table bordered>
        <Column title="仓库名称" />
        <Column title="设备编号" />
        <Column title="设备类型" />
        <Column title="是否良品" />
        <Column title="设备供应商" />
        <Column title="入库时间" />
      </Table>
    </div>
  );
};
export default DetailTab;
