import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Divider, Table, Tabs, Modal, message, Row, Col } from 'antd';
import Search from '@/pages/ChargePalOrder/components/search';
import DetailTab from '@/pages/ChargePalOrder/components/detailTab';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
import { getReason } from '@/services/applyByMe';
const Column = Table.Column;
const TabPane = Tabs.TabPane;
const getState = t => {
  switch (t) {
    case '0':
      return '已结束';
    case '1':
      return '租借中';
    case '2':
      return '购买订单';
    case '3':
      return '订单废弃';
    case '-1':
      return '未支付';
    case '-2':
      return '订单异常';
  }
};
const ChargePalOrder = ({ list, total, dispatch, loading }) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const [active, setA] = useState('1');
  const init = () => {
    dispatch({
      type: 'chargePal/getPalOrder',
      p: { ...search, per_page, page, order: 'DESC', sortby: 'createTime' },
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
          okText: '好的',
          content:
            r.data.length > 0
              ? r.data.map((i, index) => (
                  <div key={index}>
                    <Divider type="horizontal" />
                    <Row>
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
                ))
              : '暂无',
          onOk() {},
        });
      } else message.error(`请求错误:${r.msg}`, 6);
    });
  };

  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={active} onChange={v => setA(v)}>
        <TabPane tab="列表页" key="1">
          <Search {...searchProps} />
          <Table
            dataSource={list}
            rowKey="orderId"
            bordered
            scroll={{ x: 1800 }}
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
          >
            <Column
              title="操作"
              key="action"
              render={(t, r) => (
                <>
                  <a href="javascript:;">详情</a>
                  {r.orderState === '2' ? (
                    <>
                      <Divider type="vertical" />
                      <a href="javascript:;">暂停计时</a>
                    </>
                  ) : null}
                </>
              )}
            />
            <Column title="订单号" dataIndex="orderId" />
            <Column title="支付订单号" dataIndex="payOrderId" />
            <Column
              title="设备租借状态"
              dataIndex="rentStatus"
              render={t => (t === '1' ? '正常' : t === '2' ? '失败' : t === '3' ? '异常' : '')}
            />
            <Column title="订单状态" dataIndex="orderState" render={t => getState(t)} />
            <Column
              title="是否退款"
              dataIndex="returnState"
              render={t =>
                t === '1' ? '未退款' : t === '2' ? '全部退款' : t === '3' ? '部分退款' : ''
              }
            />
            <Column
              title="订单渠道"
              dataIndex="orderType"
              render={t => (t === '1' ? '微信' : t === '2' ? '支付宝' : '')}
            />
            <Column title="客户昵称" dataIndex="customerNickname" />
            <Column title="手机号码" dataIndex="customerPhone" />
            <Column title="押金方式" dataIndex="isDepositfree" />
            <Column title="租借时长" dataIndex="rentLengthTime" />
            <Column title="订单金额" dataIndex="orderMoney" />
            <Column title="实付金额" dataIndex="realPayment" />
            <Column title="已退款金额" dataIndex="returnedMoney" />
            <Column title="出借门店" dataIndex="rentStoreName" />
            <Column title="订单创建时间" dataIndex="createdTime" />
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2" disabled>
          <DetailTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ loading, chargePal }) => ({
  list: chargePal.pal.list,
  total: chargePal.pal.total,
  loading: loading.models.chargePal,
}))(ChargePalOrder);
