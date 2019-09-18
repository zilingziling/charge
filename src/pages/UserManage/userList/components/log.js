import React, { useState, useEffect } from 'react';
import { Table, Tabs, Divider } from 'antd';
import styles from '@/pages/mylayout.less';
import SearchLog from '@/pages/UserManage/userList/components/searchLog';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
const { TabPane } = Tabs;
const { Column } = Table;
const Log = ({list,loading,userId,total,dispatch}) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const init = () => {
    dispatch({
      type: 'userManage/getLog',
      p: {...search,per_page,page,userId,order:"DESC",sortby:"createTime"},
    });
  };
  useEffect(() => init(), [search, page, per_page,userId]);
  const pager={
    current: page,
    total,
    pageSize:per_page,
    showTotal: () => {
      return (
        <div className={selfStyle.total}>
          <p>共计：{total} 条</p>
        </div>
      );
    },
    showSizeChanger:true,
    showQuickJumper:true,
    onShowSizeChange:(current,pz)=>setPZ(pz),
    onChange:page=>setP(page)
  }
  const handleTableChange=pagination=>{
    setP(pagination.current);
  }
  const searchProps={
    setP,setSearch
  }
  return (
    <div>
      <SearchLog {...searchProps}/>
      <Table
        bordered
        dataSource={list}
        rowKey="id"
        pagination={pager}
        onChange={handleTableChange}
        loading={loading}
      >
        <Column title="日志类型" dataIndex="logType" />
        <Column title="发生时间" dataIndex="createTime" />
        <Column title="IP" dataIndex="operationIp" />
      </Table>
    </div>
  );
};
export default connect(({ userManage, loading }) => ({
  list: userManage.userLog.list,
  total: userManage.userLog.total,
  loading: loading.models.userManage,
}))(Log);
