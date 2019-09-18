import React, { Component } from 'react';
import style from '@/pages/SystemManage/layout.less';
import { Card, Divider, Tree, Row, Col } from 'antd';
import styles from '@/pages/SystemManage/dictionary/components/tree.less';
import RightTable from '@/pages/StorageManage/manage/components/rightTable';
const vertical = {
  height: 'auto',
};
const { TreeNode } = Tree;

const Manage = () => {
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
  return (
    <div className={style.outerWrapper}>
      <Row>
        <Card>
          <div className={styles.tree}>
            <Col span={3}>
              <Tree showLine>{renderTreeNodes([])}</Tree>
            </Col>
          </div>
          <Col span={21}>
            <RightTable />
          </Col>
        </Card>
      </Row>
    </div>
  );
};

export default Manage;
