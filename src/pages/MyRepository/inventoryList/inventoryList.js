import React, { Component } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Divider, Form, Input, Popconfirm, Table, Tabs } from 'antd';
import Search from '@/pages/MyRepository/inventoryList/components/search';
import OutInput from '@/pages/MyRepository/inventoryList/components/out_input';
const Column = Table.Column;
class InventoryList extends Component {
  render() {
    return (
      <div className={styles.contentWrapper}>
        <Tabs>
          <Tabs.TabPane tab="列表页" key="1">
            <Search />
            <Table bordered>
              <Column
                title="操作"
                render={t => (
                  <>
                    <Popconfirm title="是否标记不良品？标记不良品后，设备进入不良品库，无法出库，只能退往上级仓库">
                      <a href="javascript:;">标记不良品</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a href="javascript:;">编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">移除</a>
                  </>
                )}
              />
              <Column title="仓库名称" />
              <Column title="设备编号" />
              <Column title="设备类型" />
              <Column title="设备供应商" />
              <Column title="入库时间" />
              <Column title="是否良品" />
            </Table>
          </Tabs.TabPane>
          <Tabs.TabPane tab="入库/出库" key="2">
            <OutInput />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default InventoryList;
