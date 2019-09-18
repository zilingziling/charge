import React, { useEffect, useState } from 'react';
import { Modal, Form, Tree, message } from 'antd';
import { assign, getMenu } from '@/services/systemManage/systemManage';
import { formatTreeData } from '@/utils/handleNumber';
const { TreeNode } = Tree;
const AssignAuth = ({
  form,
  visible,
  onOk,
  onClose,
  selectKey,
  setSelectKey,
  setRoleId,
  roleId,
  initData,
}) => {
  const [treeData, setTree] = useState([]);
  useEffect(() => {
    getMenu({ pcode: 0 }).then(r => {
      formatTreeData(r.data, 'menuId');
      setTree(r.data);
    });
  }, []);
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
  const onCheck = checkedKeys => {
    setSelectKey(checkedKeys);
  };
  const modalConfirm = () => {
    assign({ menuIds: selectKey, roleId }).then(r => {
      if (r.code === '000000') {
        message.success('操作成功');
        initData();
        setRoleId(null);
        onOk();
      } else message.error(`操作失败:${r.msg}`, 6);
    });
  };
  const modalClose = () => {
    setSelectKey([]);
    onClose();
  };
  return (
    <Modal title="京猪后台权限" visible={visible} onOk={modalConfirm} onCancel={modalClose}>
      <Tree checkable autoExpandParent={true} onCheck={onCheck} checkedKeys={selectKey}>
        {renderTreeNodes(treeData)}
      </Tree>
    </Modal>
  );
};
export default Form.create()(AssignAuth);
