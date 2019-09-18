import React, { useState, useEffect } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input, Select, Table, Tabs, Divider, Popconfirm, message } from 'antd';
import SearchType from '@/pages/SystemManage/dictionary/components/searchType';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import Dictionary from '@/pages/SystemManage/dictionary/dictionary';
import { delType, getSubTree } from '@/services/systemManage/dictionary';
import { formatTreeData } from '@/utils/handleNumber';
import AddType from '@/pages/SystemManage/dictionary/components/add';
const { Column } = Table;
const TabPane = Tabs.TabPane;
const DicType = ({ dispatch, dictionary, loading }) => {
  const [tabKey, setKey] = useState('1');
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const [treeData, setTreeData] = useState([]);
  const [typeId, setTypeId] = useState(null);
  const [typeV, setTypeV] = useState(false);
  const [search, setSearch] = useState({});
  const [edit, setEdit] = useState({});
  const [title, setTitle] = useState(null);
  const [selectDic, setSelectDic] = useState(0);
  const [typeInfo, setTypeInfo] = useState({});

  const initData = () => {
    dispatch({
      type: 'dictionary/getDicType',
      payload: {
        per_page,
        page,
        ...search,
        order: 'DESC',
        sortby: 'createTime',
      },
    });
  };
  useEffect(() => {
    initData();
  }, [page, search]);
  const { dicTypeList, total } = dictionary.dicType;
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
  const clickToDic = r => {
    setKey('2');
    setTypeId(r.dictTypeId);
    setTypeInfo({
      typeName: r.name,
      typeId: r.dictTypeId,
    });
  };
  useEffect(() => {
    // 是否要传
    getSubTree({ dict_type_id: typeId && typeId, pid: null }).then(r => {
      formatTreeData(r.data, 'dictId', ['parentId']);
      setTreeData(r.data);
      setSelectDic(0);
    });
  }, [typeId]);
  const dicProps = {
    treeData,
    setSelectDic,
    selectDic,
    typeInfo,
    setTreeData,
  };
  const onOk = () => {
    initData();
    setTypeV(false);
  };
  const onClose = () => {
    setTypeV(false);
  };
  const typeProps = {
    typeV,
    onOk,
    onClose,
    edit,
    setEdit,
    title,
    initData,
  };
  const searchTypeProps = {
    setTypeV,
    setSearch,
    setPage,
    setTitle,
  };
  // 分页
  const handleTableChange = pagination => {
    setPage(pagination.current);
  };
  //编辑
  const handleEdit = ({ name, code, dictTypeId }) => {
    setEdit({ name, code, dictTypeId });
    setTitle('编辑');
    setTypeV(true);
  };
  // 删除
  const handleDel = id => {
    delType(id).then(r => {
      if (r.code === '000000') {
        message.success('操作成功');
        initData();
      } else message.error(`操作失败:${r.msg}`, 6);
    });
  };
  // tab
  const handleClickTab = v => {
    setKey(v);
    setSelectDic(null);
    dispatch({
      type: 'dictionary/clearDicList',
    });
  };
  return (
    <div className={styles.contentWrapper}>
      <Tabs activeKey={tabKey} onChange={v => handleClickTab(v)}>
        <TabPane tab="字典类型" key="1">
          <SearchType {...searchTypeProps} />
          <Table
            bordered
            dataSource={dicTypeList}
            rowKey="dictTypeId"
            pagination={pager}
            onChange={handleTableChange}
            loading={loading}
          >
            <Column
              title="操作"
              dataIndex="dictTypeId"
              render={(text, r) => (
                <>
                  <Popconfirm title={'确定删除吗？'} onConfirm={() => handleDel(r.dictTypeId)}>
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => handleEdit(r)}>
                    编辑
                  </a>
                </>
              )}
            />
            <Column
              title="类型名称"
              dataIndex="name"
              render={(text, r) => (
                <a href="javascript:;" onClick={() => clickToDic(r)}>
                  {text}
                </a>
              )}
            />
            <Column title="类型编码" dataIndex="code" />
            <Column title="创建时间" dataIndex="createTime" />
            <Column title="创建人" dataIndex="createUserName" />
          </Table>
          <AddType {...typeProps} />
        </TabPane>
        <TabPane tab="字典" key="2" disabled>
          <Dictionary {...dicProps} />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect(({ dictionary, loading }) => ({
  dictionary,
  loading: loading.models.dictionary,
}))(DicType);
