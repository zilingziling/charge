import React, { useState } from 'react';
import Tree from '@/pages/SystemManage/dictionary/components/tree';
import RightTable from '@/pages/SystemManage/dictionary/components/rightTable';
import style from '@/pages/SystemManage/layout.less';
import { Divider, Card, Row, Col } from 'antd';
const vertical = {
  height: 'auto',
};
const Dictionary = ({ treeData, setSelectDic, selectDic, typeInfo, setTreeData }) => {
  const [info, setInfo] = useState({});
  const [isSelect, setIsSelect] = useState(false);
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);

  const treeProps = {
    setSelectDic,
    setInfo,
    setIsSelect,
    treeData,
    selectDic,
    typeInfo,
    setPage,
    per_page,
    page,
    setTreeData,
    info,
  };
  const rightTableProps = {
    info,
    isSelect,
    typeInfo,
    selectDic,
    page,
    setPage,
    setPer_page,
    per_page,
    treeData,
    setTreeData,
  };
  return (
    <div className={style.outerWrapper}>
      <Row>
        <Card>
          {treeData && treeData.length > 0 ? (
            <Col span={3}>
              <Tree {...treeProps} />
            </Col>
          ) : null}
          <Col span={21}>
            <RightTable {...rightTableProps} />
          </Col>
        </Card>
      </Row>
    </div>
  );
};

export default Dictionary;
