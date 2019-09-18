import React, { Component, useEffect, useState } from 'react';
import Tree from '@/pages/SystemManage/employee/components/tree';
import RightTable from '@/pages/SystemManage/employee/components/rightTable';
import style from '@/pages/SystemManage/layout.less';
import { Divider, Card, Col, Row } from 'antd';
import Add from '@/pages/SystemManage/employee/components/add';
import { connect } from 'dva';
const vertical = {
  height: 'auto',
};
const Employee = ({ dispatch, employee }) => {
  const [visible, setV] = useState(false);
  const [title, setTitle] = useState(null);
  const [edit, setEdit] = useState({});
  const [page, setPage] = useState(1);
  const [per_page, setPer_page] = useState(10);
  const { key } = employee;
  const [search, setSearch] = useState({});
  const initData = p =>
    dispatch({
      type: 'employee/getEmpList',
      payload: {
        page,
        per_page,
        ...p,
        orgId: key,
        ...search,
      },
    });
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
  const props = {
    visible,
    onOk,
    onClose,
    title,
    setEdit,
    edit,
    page,
    per_page,
    setPage,
    initData,
  };
  const handleAdd = () => {
    setV(true);
    setTitle('新增');
  };
  // 重置搜索
  const reset = () => {
    if (page === 1) initData({ page: 1 });
    else setPage(1);
  };
  const handleEdit = ({
    staffNo,
    sex,
    staffName,
    email,
    phonenum,
    jobId,
    deptId,
    idcardNo,
    staffId,
    delFlag,
    area,
    sexCode,
  }) => {
    setV(true);
    setTitle('编辑');
    setEdit({
      staffNo,
      sex,
      staffName,
      email,
      phonenum,
      jobId,
      deptId,
      idcardNo,
      staffId,
      delFlag,
      area,
      sexCode,
    });
  };
  const opeProps = {
    handleAdd,
    handleEdit,
    initData,
    page,
    per_page,
    setPage,
    reset,
    setSearch,
  };
  return (
    <div className={style.outerWrapper}>
      <Card>
        <Col span={3}>
          <Tree />
        </Col>
        <Col span={21}>
          <RightTable {...opeProps} />
        </Col>
        <Add {...props} />
      </Card>
    </div>
  );
};

export default connect(({ employee, loading }) => ({
  employee,
  loading: loading.models.employee,
}))(Employee);
