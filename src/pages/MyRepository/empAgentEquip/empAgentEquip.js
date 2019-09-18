import React, { Component, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Table, Tabs } from 'antd';
import Search from '@/pages/MyRepository/empAgentEquip/components/search';
import DetailTab from '@/pages/MyRepository/empAgentEquip/detailTab';
const Column = Table.Column;
const TabPane = Tabs.TabPane;

const EmpAgentEquip = () => {
  const [tabKey, setKey] = useState('1');

  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search />
          <Table
            dataSource={[]}
            rowKey="roleId"
            scroll={{x:2800}}
            bordered
            // pagination={pager}
            // onChange={handleTableChange}
            // loading={loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => <a href="javascript:;">设备记录</a>}
            />
            <Column title="所在地区" />
            <Column title="员工姓名" />
            <Column title="员工联系方式" />
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

export default EmpAgentEquip;
