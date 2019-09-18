import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { connect } from 'dva';
import styles from './tree.less';
const { TreeNode, DirectoryTree } = Tree;

const CustomTree = ({
  dispatch,
  treeData,
  setInfo,
  setIsSelect,
  setSelectDic,
  selectDic,
  typeInfo,
  setPage,
  page,
  per_page,
}) => {
  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  useEffect(
    p => {
      dispatch({
        type: 'dictionary/getDicList',
        payload: {
          page,
          per_page,
          ...p,
          dict_type_id: typeInfo.typeId && typeInfo.typeId,
          pid: selectDic,
          order: 'DESC',
          sortby: 'createTime',
        },
      });
    },
    [selectDic, typeInfo.typeId]
  );
  const handleSelect = (key, { selectedNodes }) => {
    if (key && key.length > 0) {
      setSelectDic(key[0]);
      setIsSelect(true);
      setInfo({
        dictTypeId: key[0],
      });
      setPage(1);
    } else {
      setInfo({});
      setIsSelect(false);
      setSelectDic(null);
      setPage(1);
      setInfo({
        dictTypeId: null,
      });
    }
  };
  return (
    <div className={styles.tree}>
      <Tree defaultSelectedKeys={[treeData[0].key]} showLine onSelect={handleSelect}>
        {renderTreeNodes(treeData)}
      </Tree>
    </div>
  );
};
export default connect(({ dictionary }) => ({
  dictionary,
}))(CustomTree);
