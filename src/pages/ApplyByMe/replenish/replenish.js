import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs, Modal, message, Row, Col } from 'antd';
import Search from '@/pages/ApplyByMe/replenish/components/search';
import ReplenishTab from '@/pages/ApplyByMe/replenish/replenishTab';
import DetailTab from '@/pages/ApplyByMe/replenish/detailTab';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
import { getReason } from '@/services/applyByMe';
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
  const init = () => {
    dispatch({
      type: 'apply/getReplenish',
      p: { ...search, per_page, page, order: 'DESC', sortby: 'createTime', type: 1 },
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
    dispatch,
  };
  const checkReason = r => {
    getReason({ sceneId: r.replenishId, type: 1 }).then(r => {
      if (r.code === '000000') {
        Modal.info({
          title: '查看原因',
          okText:"好的",
          content:r.data.length>0? r.data.map((i,index) => (
            <div key={index}>
              <Divider type="horizontal"/>
              <Row >
              <Col span={24}>
                <p>审核人：{i.userName}</p>
              </Col>
              <Col span={24}>
                <p>原因：{i.remarks}</p>
              </Col>
              <Col span={24}>
                <p>审核时间：{i.createTime}</p>
              </Col>
            </Row>
            </div>
          )):"暂无",
          onOk() {},
        });
      } else message.error(`请求错误:${r.msg}`, 6);
    });
  };
  const operate = r => {
    switch (r.auditState) {
      case '0':
        return '暂无';
      case '1':
        return (
          <a href="javascript:;" onClick={() => checkReason(r)}>
            原因
          </a>
        );
      case '2':
        return <a href="javascript:;" onClick={() => checkReason(r)}>原因</a>;
      case '3':
        return (
          <>
            <a href="javascript:;" onClick={() => checkReason(r)}>原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">收货</a>
          </>
        );
      case '4':
        return (
          <>
            <a href="javascript:;" onClick={() => checkReason(r)}>原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">回执单</a>
          </>
        );
      case '5':
        return (
          <>
            <a href="javascript:;" onClick={() => checkReason(r)}>原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">明细</a>
            <Divider type="vertical" />
            <a href="javascript:;">回执单</a>
          </>
        );
      case '6':
        return (
          <>
            <a href="javascript:;" onClick={() => checkReason(r)}>原因</a>
            <Divider type="vertical" />
            <a href="javascript:;">明细</a>
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
          <Search {...searchProps} />
          <Table
            dataSource={list}
            rowKey="replenishId"
            bordered
            scroll={{ x: 1800 }}
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
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
        <TabPane tab="补货" key="2">
          <ReplenishTab {...replenishP} />
        </TabPane>
        <TabPane tab="明细" key="3" disabled>
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ loading, apply }) => ({
  list: apply.replenish.list,
  total: apply.replenish.total,
  loading: loading.models.apply,
}))(Replenish);
