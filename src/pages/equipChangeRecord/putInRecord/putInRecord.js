import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/putInRecord/components/search';
import DetailTab from '@/pages/equipChangeRecord/putInRecord/detailTab';
const Column = Table.Column;
const TabPane = Tabs.TabPane;

const PutInRecord = () => {
  const [tabKey, setKey] = useState('1');

  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            dataSource={[]}
            rowKey="roleId"
            bordered
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => (
                <>
                  <a href="javascript:;">移除</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">详情</a>
                </>
              )}
            />
            <Column title="状态" />
            <Column title="入库仓库" />
            <Column title="入库方式" />
            <Column title="入库数量" />
            <Column title="入库日期" />
            <Column title="操作人" />
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2">
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PutInRecord;
