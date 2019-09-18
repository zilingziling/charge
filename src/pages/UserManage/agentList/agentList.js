import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Divider, Table, Tabs } from 'antd';
import Search from '@/pages/UserManage/agentList/components/search';
import Add from '@/pages/UserManage/agentList/components/add';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
import btnStyle from '@/pages/btnStyle.less';
const { TabPane } = Tabs;
const { Column } = Table;
const AgentList = ({ list, total, dispatch, loading }) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const [edit, setEdit] = useState({});
  const [active, setA] = useState("1");
  const init = () => {
    dispatch({
      type: 'userManage/getAgent',
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
  const handleEdit=r=>{
      setEdit(r)
      setA("2")
  }
  const editProps={
    edit,
    setA,
    init,
    setEdit
  }
  const changeTab=(k)=>{
    setA(k)
    setEdit({})
  }
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={active} onChange={k=>changeTab(k)}>
        <TabPane tab="代理列表" key="1">
          <Search {...searchProps} />
          <Table
            bordered
            dataSource={list}
            rowKey="agentId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
            scroll={{x:1800}}
          >
            <Column
              title="操作"
              dataIndex=""
              render={(text, r) => <a href="javascript:;" onClick={()=>handleEdit(r)}>编辑</a>}
            />
            <Column
              title="代理ID"
              dataIndex="agentId"
              render={(text, r) => <a href="javascript:;">{text}</a>}
            />
            <Column title="代理类型" dataIndex="agentType" />
            <Column title="代理等级" dataIndex="agentlevelname" />
            <Column title="联系人" dataIndex="realName" />
            <Column title="联系方式" dataIndex="mobile" />
            <Column title="企业名称" dataIndex="companyName" />
            <Column title="分润比例" dataIndex="agentReward" />
            <Column title="负责区域" dataIndex="fuzearea" />
            <Column title="所在地区" dataIndex="area" />
            <Column title="创建时间" dataIndex="createTime" />
          </Table>
        </TabPane>
        <TabPane tab="新增/编辑" key="2">
          <Add {...editProps}/>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ loading, userManage }) => ({
  list: userManage.agent.list,
  total: userManage.agent.total,
  loading: loading.models.userManage,
}))(AgentList);
