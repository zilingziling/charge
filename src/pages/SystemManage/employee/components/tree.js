import React, { useEffect, useState } from 'react';
import { Icon, Tree, Modal, message } from 'antd';
import { formatTreeData } from '@/utils/handleNumber';
import { connect } from 'dva';
import { delTree, getEmpTree } from '@/services/systemManage/employee';
import AddTree from '@/pages/SystemManage/employee/components/opeTree/addTree';
import styles from '@/pages/SystemManage/dictionary/components/tree.less';
const { TreeNode } = Tree;
const confirm = Modal.confirm;

const icons = {
  boxSizing: 'border-box',
  padding: 8,
  display: 'flex',
  justifyContent: 'space-between',
};
const CustomTree = ({ dispatch }) => {
  const [treeData, setTree] = useState([]);
  const [selectOrg, setSelectOrg] = useState(null);
  const [isSelect, setIsSelect] = useState(false);
  const [title, setTitle] = useState(null);
  const [visible, setV] = useState(false);
  const [edit, setEdit] = useState({});
  const [info, setInfo] = useState({});
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    dispatch({
      type: 'employee/getEmpList',
      payload: {
        orgId: selectOrg,
      },
    });
  }, [selectOrg]);
  const initData = () => {
    getEmpTree({ pid: 0 }).then(r => {
      formatTreeData(r.data, 'deptId', ['pid']);
      setTree(r.data);
      dispatch({
        type: 'employee/saveDepData',
        payload: {
          depData: r.data,
        },
      });
    });
  };
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
  const handleSelect = (key, { selectedNodes }) => {
    if (key && key.length > 0) {
      setSelectOrg(key[0]);
      setIsSelect(true);
      setInfo({ fullName: selectedNodes[0].props.title, pid: selectedNodes[0].props.dataRef.pid });
    } else {
      setSelectOrg(null);
      setIsSelect(false);
      setInfo({});
    }
  };
  const onOk = () => {
    setV(false);
    initData();
    setInfo({});
  };
  const onClose = () => {
    setV(false);
    setInfo({});
  };
  const addTreeProps = {
    visible,
    onOk,
    onClose,
    title,
    edit,
    setEdit,
    info,
    selectOrg,
  };
  const handleAddTree = () => {
    setTitle('新增');
    setV(true);
  };
  const handleEditTree = () => {
    setTitle('编辑');
    setV(true);
    setEdit({ fullName: info.fullName });
  };
  const handleDelTree = () => {
    confirm({
      title: '确定要删除所选组织吗？',
      onOk() {
        delTree({ OrgId: selectOrg }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            initData();
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      },
      onCancel() {},
    });
  };
  return (
    <div>
      <div style={icons}>
        <Icon type="plus-circle" theme="twoTone" onClick={handleAddTree} />
        {isSelect && (
          <>
            <Icon type="edit" theme="twoTone" onClick={handleEditTree} />
            <Icon type="delete" theme="twoTone" onClick={handleDelTree} />
          </>
        )}
      </div>
      <div className={styles.tree}>
        <Tree showLine onSelect={handleSelect}>
          {renderTreeNodes(treeData)}
        </Tree>
      </div>
      <AddTree {...addTreeProps} />
    </div>
  );
};
export default connect(({ employee }) => ({
  employee,
}))(CustomTree);
