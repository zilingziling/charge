import React, { useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table, Tabs, Divider } from 'antd';
import Search from '@/pages/Content/platform/components/search';
import Add from '@/pages/Content/platform/components/add';
const { Column } = Table;
const TabPane = Tabs.TabPane;
const Platform = () => {
  const [tabKey, setKey] = useState('1');
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            bordered
            // dataSource={list}
            rowKey="id"
            // pagination={pager}
            // onChange={this.handleTableChange}
            // loading={this.props.loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={text =>
                text === 1 ? (
                  <>
                    <a href="javascript:;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">删除</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">发送</a>
                  </>
                ) : text === 2 ? (
                  <>
                    <a href="javascript:;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">撤回</a>
                  </>
                ) : null
              }
            />
            <Column title="标题" dataIndex="tags" />
            <Column title="状态" dataIndex="tags" />
            <Column title="内容" dataIndex="tags" />
            <Column title="创建人" dataIndex="tags" />
            <Column title="创建时间" dataIndex="tags" />
            <Column title="发布时间" dataIndex="tags" />
          </Table>
        </TabPane>
        <TabPane tab="新增" key="2">
          <Add />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default Platform;
