import React, { useState, useEffect } from 'react';
import { Table, Tabs, Divider } from 'antd';
import styles from '@/pages/mylayout.less';
import Search from '@/pages/UserManage/userList/components/search';
import Log from '@/pages/UserManage/userList/components/log';
import Details from '@/pages/UserManage/userList/components/details.js';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { userDetail } from '@/services/userManage/userManage';
const { TabPane } = Tabs;
const { Column } = Table;
const userList = ({ list, total, dispatch, loading }) => {
  const [search, setSearch] = useState({});
  const [page, setP] = useState(1);
  const [per_page, setPZ] = useState(10);
  const [active, setA] = useState('1');
  const [detail, setD] = useState({});
  const [userId, setID] = useState(null);
  const init = () => {
    dispatch({
      type: 'userManage/getUser',
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
    const { userSourceCode, userId } = r;
    userDetail({ userSourceCode, userId }).then(r => {
      setA('2');
      setD(r.data);
    });
  };
  const dProps = {
    detail,
  };
  const handleLog = r => {
    setID(r.userId);
    setA('3');
  };
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={active} onChange={k => setA(k)}>
        <TabPane tab="用户列表" key="1">
          <Search {...searchProps} />
          <Table
            bordered
            dataSource={list}
            rowKey="userId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
          >
            <Column
              title="操作"
              dataIndex=" "
              render={(text, r) => (
                <>
                  <a href="javascript:;" onClick={() => handleDetail(r)}>
                    详情
                  </a>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => handleLog(r)}>
                    行为日志
                  </a>
                </>
              )}
            />
            <Column
              title="客户ID"
              dataIndex="userId"
              render={(text, r) => <a href="javascript:;">{text}</a>}
            />
            <Column title="客户来源" dataIndex="userSource" />
            <Column title="绑定手机号" dataIndex="mobile" />
            <Column title="关注情况" dataIndex="attention" />
            <Column title="创建时间" dataIndex="createTime" />
          </Table>
        </TabPane>
        <TabPane tab="详情" key="2" disabled>
          <Details {...dProps} />
        </TabPane>
        <TabPane tab="日志" key="3" disabled>
          <Log userId={userId} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(({ loading, userManage }) => ({
  list: userManage.userList.list,
  total: userManage.userList.total,
  loading: loading.models.userManage,
}))(userList);
