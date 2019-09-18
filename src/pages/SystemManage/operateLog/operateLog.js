import React, { Component, useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table } from 'antd';
import Search from '@/pages/SystemManage/operateLog/components/search';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { connect } from 'dva';
const { Column } = Table;
const OperateLog = ({ dispatch, systemM, loading }) => {
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const [search, setSearch] = useState({});
  const { opeList, total } = systemM.opeLog;
  const init = p => {
    dispatch({
      type: 'systemM/getOpe',
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
        dataSource={opeList}
        rowKey="operationLogId"
        pagination={pager}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 2600 }}
      >
        <Column title="日志类型" dataIndex="logType" width={150} />
        <Column title="日志名称" dataIndex="logName" width={250} />
        <Column title="用户名" dataIndex="userName" width={150} />
        <Column title="类名" dataIndex="className" width={300} />
        <Column title="方法名" dataIndex="method" width={250} />
        <Column title="时间" dataIndex="createTime" width={250} />
        <Column title="具体消息" dataIndex="message" />
      </Table>
    </div>
  );
};
export default connect(({ loading, systemM }) => ({
  systemM,
  loading: loading.models.systemM,
}))(OperateLog);
