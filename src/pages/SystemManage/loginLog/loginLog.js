import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table } from 'antd';
import Search from '@/pages/SystemManage/loginLog/components/search';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
const { Column } = Table;
const LoginLog = ({ dispatch, systemM, loading }) => {
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const [search, setSearch] = useState({});
  const { loginList, total } = systemM.loginLog;
  const init = p => {
    dispatch({
      type: 'systemM/getLogin',
      payload: {
        ...search,
        page,
        per_page,
        ...p,
      },
    });
  };
  useEffect(() => {
    init();
  }, [page, per_page, search]);
  const searchProps = {
    setSearch,
    setPage,
  };
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
  };
  const handleTableChange = pagination => {
    setPage(pagination.current);
  };
  return (
    <div className={styles.contentWrapper}>
      <Search {...searchProps} />
      <Table
        bordered
        dataSource={loginList}
        rowKey="loginLogId"
        pagination={pager}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 1600 }}
      >
        <Column title="用户名" dataIndex="userName" width={150} />
        <Column title="时间" dataIndex="createTime" width={250} />
        <Column title="IP" dataIndex="ipAddress" width={150} />
        <Column title="具体消息" dataIndex="message" />
      </Table>
    </div>
  );
};
export default connect(({ loading, systemM }) => ({
  systemM,
  loading: loading.models.systemM,
}))(LoginLog);
