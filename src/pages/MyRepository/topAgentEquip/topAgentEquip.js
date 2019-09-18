import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Table, Tabs } from 'antd';
import Search from '@/pages/MyRepository/topAgentEquip/components/search';
import DetailTab from '@/pages/MyRepository/topAgentEquip/detailTab';
const Column = Table.Column;
const TabPane = Tabs.TabPane;

const TopAgentEquip = () => {
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
            scroll={{x:2800}}
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => <a href="javascript:;">设备记录</a>}
            />
            <Column title="总代理名称" />
            <Column title="总代理联系方式" />
            <Column title="6口设备" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="12口设备" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="充电线" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="充电宝" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="机柜A型" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="机柜B-1型" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
            <Column title="机柜B-2型" children={[{
              title:'领取总量',
            },{
              title:'待使用',
            },
              {
                title:'已分配',
              },
              {
                title:'已部署',
              },
            ]}/>
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2">
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TopAgentEquip;
