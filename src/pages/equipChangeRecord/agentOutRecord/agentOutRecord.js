import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/equipChangeRecord/agentOutRecord/components/search';
import DetailTab from '@/pages/equipChangeRecord/agentOutRecord/detailTab';
const Column = Table.Column;
const TabPane = Tabs.TabPane;

const AgentOutRecord = () => {
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
              render={(text, record) => <a href="javascript:;">详情</a>}
            />
            <Column title="发货仓库" />
            <Column title="代理姓名" />
            <Column title="代理联系方式" />
            <Column title="出库方式" />
            <Column title="出库总量" />
            <Column title="出库日期" />
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

export default AgentOutRecord;
