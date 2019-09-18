import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Col, Divider, Table, Tabs } from 'antd';
import Search from '@/pages/UserManage/shopList/components/search';
import Details from '@/pages/UserManage/shopList/components/details';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { shopD, userDetail } from '@/services/userManage/userManage';
import { connect } from 'dva';
import btnStyle from "@/pages/btnStyle.less"
import Add from "@/pages/UserManage/shopList/components/add"
const { TabPane } = Tabs;
const { Column } = Table;
const ShopList = ({ list, total, dispatch, loading }) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const [active, setA] = useState('1');
  const [detail, setD] = useState({});
  const [addV, setV] = useState(false);
  const init = () => {
    dispatch({
      type: 'userManage/getShop',
      p: { ...search, per_page, page,order:"DESC",sortby:"createTime" },
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
  const handleDetail = r => {
    const { businessId} = r;
    shopD({ businessId }).then(r => {
      setA('2');
      setD(r.data);
    });
  };
  const dProps = {
    detail,
  };

  const addP={
    addV,
    setV
  }
  const clickAdd=()=>{
    setV(true)
  }
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={active} onChange={k => setA(k)}>
        <TabPane tab="代理列表" key="1">
          <Button icon="plus"  className={btnStyle.add} onClick={clickAdd}>
            新增
          </Button>
          <Add {...addP}/>
          <Search {...searchProps}/>
          <Table
            bordered
            dataSource={list}
            rowKey="businessId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
          >
            <Column
              title="操作"
              dataIndex=" "
              render={(text, r) => <a href="javascript:;" onClick={()=>handleDetail(r)}>详情</a>}
            />
            <Column
              title="商户ID"
              dataIndex="businessId"
              render={(text, r) => <a href="javascript:;">{text}</a>}
            />
            <Column title="商户来源" dataIndex="code" />
            <Column title="商户名称" dataIndex="businessName" />
            <Column title="主体名称" dataIndex="subjectName" />
            <Column title="主体类型" dataIndex="licenseType" />
            <Column title="认证状态" dataIndex="certification" />
            <Column title="绑定手机号码" dataIndex="businessPhone" />
            <Column title="创建时间" dataIndex="createTime" />
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2" disabled>
          <Details {...dProps}/>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ loading, userManage }) => ({
  list: userManage.shop.list,
  total: userManage.shop.total,
  loading: loading.models.userManage,
}))(ShopList);
