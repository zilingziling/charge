import React, { Component, useState } from 'react';
import { Card, Divider, Popconfirm, Table, Tabs, Tree } from 'antd';
import Search from '@/pages/StorageManage/list/components/search';
import styles from '@/pages/mylayout.less';
import DetailTab from '@/pages/StorageManage/list/components/detailTab';

const { TreeNode } = Tree;
const Column = Table.Column;
const TabPane = Tabs.TabPane;
const List = () => {
  const [tabKey, setKey] = useState('1');

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            bordered
            dataSource={[]}
            rowKey="roleId"
            scroll={{ x: 2600 }}
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => <a href="javascript:;">设备详情</a>}
            />
            <Column title="仓库名称"  />
            <Column title="所属地区" dataIndex="roleCode"  />
            <Column
              title="6口设备"
              dataIndex="sort"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="12口设备"
              dataIndex="sort"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="充电线"
              dataIndex="sort"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="充电宝"
              dataIndex="sort"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="机柜A型"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="机柜B-1型"
              dataIndex="sort"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column
              title="机柜B-2型"
              children={[
                {
                  title: '总计',
                  width: 100,
                },
                {
                  title: '良品',
                  width: 100,
                },
                {
                  title: '不良品',
                  width: 100,
                },
              ]}
            />
            <Column title="仓库负责人" />
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2">
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default List;
