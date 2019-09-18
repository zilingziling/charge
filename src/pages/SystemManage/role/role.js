import React, { useState, useEffect } from 'react';
import styles from '@/pages/mylayout.less';
import { Table, Tabs, Divider, Popconfirm, message } from 'antd';
import Search from '@/pages/SystemManage/role/components/search';
import Add from '@/pages/SystemManage/role/components/add';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { deleteRole, getSelectKey } from '@/services/systemManage/systemManage';
import AssignAuth from '@/pages/SystemManage/role/components/assignAuth';
const { Column } = Table;
const TabPane = Tabs.TabPane;
const Role = ({ dispatch, systemM, loading }) => {
  const [tabKey, setKey] = useState('1');
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const [edit, setEdit] = useState({});
  const [visible, setV] = useState(false);
  const [selectKey, setSelectKey] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [search, setSearch] = useState({});

  const initData = p =>
    dispatch({
      type: 'systemM/getRoles',
      payload: {
        page,
        per_page,
        ...p,
        ...search,
        order: 'DESC',
        sortby: 'createTime',
      },
    });
  useEffect(() => {
    initData();
  }, [page, search]);
  const { roleList, total } = systemM.role;
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
  // 分页
  const handleTableChange = pagination => {
    setPage(pagination.current);
  };
  // 重置搜索
  const reset = () => {
    if (page === 1) initData({ page: 1 });
    else setPage(1);
  };
  // 搜索参数
  const searchProps = {
    initData,
    reset,
    setSearch,
    setPage,
    setV,
  };
  // 新增和编辑
  const props = {
    initData,
    setKey,
    edit,
    setEdit,
  };
  // 编辑
  const handleEdit = ({ name, roleCode, sort, roleId }) => {
    setKey('2');
    setEdit({
      name,
      roleCode,
      sort,
      roleId,
    });
  };
  // 删除
  const handleDelete = id => {
    deleteRole(id).then(r => {
      if (r.code === '000000') {
        message.success('操作成功');
        initData();
      } else message.error(`操作失败:${r.msg}`, 6);
    });
  };
  // 配置权限
  const onOk = () => {
    setV(false);
  };
  const onClose = () => {
    setV(false);
  };
  const assignProps = {
    visible,
    onOk,
    onClose,
    selectKey,
    setSelectKey,
    roleId,
    setRoleId,
    initData,
  };
  const handleAssign = id => {
    setRoleId(id);
    getSelectKey(id).then(r => setSelectKey(r.data));
    setV(true);
  };

  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => setKey(v)}>
        <TabPane tab="列表页" key="1">
          <Search {...searchProps} />
          <Table
            bordered
            dataSource={roleList}
            rowKey="roleId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
          >
            <Column
              title="操作"
              dataIndex="tags"
              render={(text, record) => (
                <>
                  <a href="javascript:;" onClick={() => handleEdit(record)}>
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={`是否删除${record.name}`}
                    onConfirm={() => handleDelete(record.roleId)}
                  >
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => handleAssign(record.roleId)}>
                    权限配置
                  </a>
                </>
              )}
            />
            <Column title="角色名称" dataIndex="name" />
            <Column title="角色编码" dataIndex="roleCode" />
            <Column title="排序" dataIndex="sort" />
          </Table>
          <AssignAuth {...assignProps} />
        </TabPane>
        <TabPane tab="新增/编辑" key="2">
          <Add {...props} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(({ systemM, loading }) => ({
  systemM,
  loading: loading.models.systemM,
}))(Role);
