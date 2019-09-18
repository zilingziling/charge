import React, { Component } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/UserManage/serviceProList/components/search';
import Add from '@/pages/UserManage/serviceProList/components/add';
const { TabPane } = Tabs;
const { Column } = Table;
const ServiceProList = () => {
  return (
    <div className={styles.contentWrapper}>
      <Tabs>
        <TabPane tab="代理列表" key="1">
          <Search />
          <Table
            bordered
            dataSource={[]}
            rowKey="dictTypeId"
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              dataIndex="dictTypeId"
              render={(text, r) => (
                <>
                  <a href="javascript:;">编辑</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">详情</a>
                </>
              )}
            />
            <Column
              title="服务商ID"
              dataIndex="name"
              render={(text, r) => <a href="javascript:;">{text}</a>}
            />
            <Column title="服务商类型" dataIndex="code" />
            <Column title="服务商等级" dataIndex="createTime" />
            <Column title="联系人" dataIndex="createUser" />
            <Column title="联系方式" dataIndex="hhh" />
            <Column title="企业名称" dataIndex="createUser" />
            <Column title="分润比例" dataIndex="hhh" />
            <Column title="负责区域" dataIndex="createUser" />
            <Column title="创建时间" dataIndex="hhh" />
          </Table>
        </TabPane>
        <TabPane tab="新增/编辑" key="2">
          <Add />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ServiceProList;
