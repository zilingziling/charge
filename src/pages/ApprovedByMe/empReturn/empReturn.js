import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/ApprovedByMe/empReturn/components/search';
import DetailTab from '@/pages/ApprovedByMe/empReturn/detailTab';
import ReceiveTab from '@/pages/ApprovedByMe/empReturn/receive';
const Column = Table.Column;
const TabPane = Tabs.TabPane;
const EmpReturn = () => {
  const [tabKey, setKey] = useState('1');

  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            bordered
            dataSource={[]}
            rowKey="roleId"
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              render={t => (
                <>
                  <a href="javascript:;">审核</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">原因</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">明细</a>
                </>
              )}
            />
            <Column title="员工名称" />
            <Column title="员工联系方式" />
            <Column title="上级主管姓名" />
            <Column title="状态" />
            <Column title="6口设备" />
            <Column title="12口设备" />
            <Column title="充电线" />
            <Column title="充电宝" />
            <Column title="机柜" />
            <Column title="广告屏（3128）" />
            <Column title="收货仓库" />
            <Column title="操作人" />
            <Column title="申请时间" />
          </Table>
        </TabPane>
        <TabPane tab="收货" key="2">
          <ReceiveTab />
        </TabPane>
        <TabPane tab="明细" key="3">
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmpReturn;
