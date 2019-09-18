import React, { useEffect, useState } from 'react';
import Search from '@/pages/SystemManage/dictionary/components/search';
import { Divider, message, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import AddDic from '@/pages/SystemManage/dictionary/components/addDic';
import { deleteRole } from '@/services/systemManage/systemManage';
import { delDic, getSubTree } from '@/services/systemManage/dictionary';
import { formatTreeData } from '@/utils/handleNumber';
const Column = Table.Column;
const right = {
  flexGrow: 1,
};
const mt20 = {
  marginTop: 20,
};
const RightTable = ({
  dictionary,
  info,
  loading,
  dispatch,
  isSelect,
  typeInfo,
  selectDic,
  page,
  setPage,
  per_page,
  treeData,
  setTreeData,
}) => {
  const { dicList, total } = dictionary.dic;
  const [visible, setV] = useState(false);
  const [search, setSearch] = useState({});
  const [title, setTitle] = useState(null);
  const [edit, setEdit] = useState({});

  const initData = p => {
    dispatch({
      type: 'dictionary/getDicList',
      payload: {
        page,
        per_page,
        ...p,
        dict_type_id: typeInfo.typeId && typeInfo.typeId,
        pid: selectDic,
        // pid: selectDic && selectDic,
        ...search,
        order: 'DESC',
        sortby: 'createTime',
      },
    });
  };
  useEffect(() => {
    initData();
  }, [page, search]);
  const onOk = () => {
    setV(false);
    initData();
  };
  const onClose = () => {
    setV(false);
  };
  const modalProps = {
    onOk,
    onClose,
    visible,
    info,
    title,
    edit,
    setEdit,
    typeInfo,
    selectDic,
    treeData,
    setTreeData,
  };
  const searchProps = {
    setV,
    setSearch,
    setPage,
    setTitle,
    isSelect,
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
  //分页
  const handleTableChange = pagination => {
    setPage(pagination.current);
  };
  const handleEdit = ({ dictTypeId, parentId, name, code, dictId }) => {
    setV(true);
    setTitle('编辑');
    setEdit({ dictTypeId, parentId, name, code, dictId });
  };
  // 删除
  const handleDelete = id => {
    delDic(id).then(r => {
      if (r.code === '000000') {
        message.success('操作成功');
        initData();
        getSubTree({
          dict_type_id: typeInfo.typeId,
          // pid: selectDic ? selectDic : null,
        }).then(r => {
          formatTreeData(r.data, 'dictId', ['parentId']);
          setTreeData(r.data);
        });
      } else message.error(`操作失败:${r.msg}`, 6);
    });
  };
  return (
    <div style={right}>
      <Search {...searchProps} />
      <AddDic {...modalProps} />
      <Table
        bordered
        style={mt20}
        dataSource={dicList}
        rowKey="dictId"
        pagination={pager}
        onChange={handleTableChange}
        loading={loading}
      >
        <Column
          title="操作"
          dataIndex="dictId"
          render={(text, r) => (
            <>
              <a href="javascript:;" onClick={() => handleEdit(r)}>
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm title="是否删除" onConfirm={() => handleDelete(r.dictId)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </>
          )}
        />
        <Column title="字典名称" dataIndex="name" />
        <Column title="字典编码" dataIndex="code" />
        <Column title="添加时间" dataIndex="createTime" />
        <Column title="创建人" dataIndex="createUserName" />
      </Table>
    </div>
  );
};
export default connect(({ dictionary, loading }) => ({
  dictionary,
  loading: loading.models.dictionary,
}))(RightTable);
