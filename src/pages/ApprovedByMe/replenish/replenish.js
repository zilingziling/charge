import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs } from 'antd';
import Search from '@/pages/ApprovedByMe/replenish/components/search';
import DetailTab from '@/pages/ApprovedByMe/replenish/detailTab';
import DeliverTab from '@/pages/ApprovedByMe/replenish/deliver';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Audit from '@/pages/ApprovedByMe/replenish/components/audit';
import { connect } from 'dva';
const Column = Table.Column;
const TabPane = Tabs.TabPane;

const getState = t => {
  switch (t) {
    case '0':
      return '待初审';
    case '1':
      return '待复审';
    case '2':
      return '待发货';
    case '3':
      return '待收货';
    case '4':
      return '收货待审核';
    case '5':
      return '已完成';
    case '6':
      return '已拒绝';
  }
};
const Replenish = ({ list, total, dispatch, loading }) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const [active, setA] = useState('1');
  const [deliverInfo, setdeliver] = useState({});
  const [auditV, setAuditV] = useState(false);
  const [selectId, setId] = useState(null);
  const init = () => {
    dispatch({
      type: 'approve/getReplenish',
      p: { ...search, per_page, page, order: 'DESC', sortby: 'createTime', type: 2 },
    });
  };
  useEffect(() => init(), [search, page, per_page]);
  const pager = {
    current: page,
    total,
    pageSize: per_page,
    showTotal: () => {
      return (
        <div className={selfStyle.total}>
          <p>共计：{total} 条</p>
        </div>
      );
    },
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (current, pz) => setPZ(pz),
    onChange: page => setP(page),
  };
  const handleTableChange = pagination => {
    setP(pagination.current);
  };
  const searchProps = {
    setP,
    setSearch,
  };
  const replenishP = {
    init,
    setA,
  };
  const handleDeliver = r => {
    setdeliver(r);
    setA('2');
  };
  const deliverProps = {
    deliverInfo,
    init,
    setA,
    selectId,
    setdeliver
  };
  const clickAudit = r => {
    setId(r.replenishId);
    setAuditV(true);
  };
  const auditProps = {
    selectId,
    init,
    auditV,
    setAuditV,
    dispatch,
  };
  const operate = r => {
    switch (r.auditState) {
      case '0':
        return (
          <>
            <a href="javascript:;" onClick={() => clickAudit(r)}>
              审核
            </a>
          </>
        );
      case '1':
        return (
          <>
            <a href="javascript:;" onClick={() => clickAudit(r)}>
              审核
            </a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
          </>
        );
      case '2':
        return (
          <>
            <a href="javascript:;" onClick={() => handleDeliver(r)}>
              发货
            </a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
          </>
        );
      case '3':
        return (
          <>
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
          </>
        );
      case '4':
        return (
          <>
            <a href="javascript:;" onClick={() => clickAudit(r)}>
              审核
            </a>
            <Divider type="vertical" />
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">回执单</a>
          </>
        );
      case '5':
        return (
          <>
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">回执单</a>
          </>
        );
      case '6':
        return (
          <>
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">回执单</a>
          </>
        );
    }
  };
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={active} onChange={v => setA(v)}>
        <TabPane tab="列表页" key="1">
          <Audit {...auditProps} />
          <Search {...searchProps} />
          <Table
            bordered
            dataSource={list}
            rowKey="replenishId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
            scroll={{ x: 2000 }}
          >
            <Column title="操作" key="action" render={(t, r) => operate(r)} />
            <Column title="状态" dataIndex="auditState" render={t => getState(t)} />
            <Column title="6口设备" dataIndex="deviceCountSix" />
            <Column title="12口设备" dataIndex="deviceCountTwelve" />
            <Column title="充电线" dataIndex="chargingLineCount" />
            <Column title="充电宝" dataIndex="terminalCount" />
            <Column title="机柜A型" dataIndex="cabinetCountA" />
            <Column title="柜机B-1型" dataIndex="cabinetCountB1" />
            <Column title="柜机B-2型" dataIndex="cabinetCountB2" />
            <Column title="补货仓库" dataIndex="replenishStorageName" />
            <Column title="发货仓库" dataIndex="sendStorageName" />
            <Column title="操作人" dataIndex="userName" />
            <Column title="申请时间" dataIndex="createTime" />
          </Table>
        </TabPane>
        <TabPane tab="发货" key="2" disabled>
          <DeliverTab {...deliverProps} />
        </TabPane>
        <TabPane tab="明细" key="3" disabled>
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ loading, approve }) => ({
  list: approve.replenish.list,
  total: approve.replenish.total,
  loading: loading.models.approve,
}))(Replenish);
