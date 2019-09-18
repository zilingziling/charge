import React, { useEffect, useState } from 'react';
import Search from '@/pages/SystemManage/employee/components/search';
import { Divider, Popconfirm, Table, Checkbox, message, Form, Input } from 'antd';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { delStaff, syncStaff } from '@/services/systemManage/employee';
const Column = Table.Column;
const right = {
  width: '100%',
};
const mt20 = {
  marginTop: 20,
};
const RightTable = ({
  page,
  per_page,
  employee,
  handleEdit,
  handleAdd,
  loading,
  setPage,
  initData,
  reset,
  setSearch,
  form,
}) => {
  const { empList, total } = employee.emp;
  const { getFieldDecorator, getFieldsValue, resetFields } = form;

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
  const handleDel = id => {
    delStaff(id).then(r => {
      if (r.code === '000000') {
        message.success('删除成功');
        initData();
      } else message.error(`删除失败:${r.msg}`, 6);
    });
  };
  const handleSync = id => {
    const isBd = getFieldsValue(['isBd']);
    syncStaff({ id, ...isBd }).then(r => {
      if (r.code === '000000') {
        message.success('同步成功');
        initData();
        resetFields();
      } else message.error(`同步失败:${r.msg}`, 6);
    });
  };
  const searchProps = {
    handleAdd,
    initData,
    reset,
    setSearch,
    setPage,
  };
  const FormItem = Form.Item;
  const isSync = name => {
    return (
      <>
        <span>是否同步账号？</span>
        <Form layout="inline">
          <FormItem label={`员工姓名:${name}`}>
            {getFieldDecorator('isBd')(<Checkbox>是否是市场人员？</Checkbox>)}
          </FormItem>
        </Form>
      </>
    );
  };
  return (
    <div style={right}>
      <Search {...searchProps} />
      <Table
        bordered
        style={mt20}
        dataSource={empList}
        rowKey="staffId"
        pagination={pager}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 2000 }}
      >
        <Column
          title="操作"
          dataIndex="staffId"
          render={(text, r) => (
            <>
              <a href="javascript:; " onClick={() => handleEdit(r)}>
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm title={`是否删除${r.staffName}`} onConfirm={() => handleDel(r.staffId)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title={isSync(r.staffName)} onConfirm={() => handleSync(r.staffId)}>
                <a href="javascript:;">同步用户</a>
              </Popconfirm>
            </>
          )}
        />
        <Column title="员工工号" dataIndex="staffNo" />
        <Column title="姓名" dataIndex="staffName" />
        <Column title="性别" dataIndex="sex" />
        <Column title="所在地区" dataIndex="areaName" />
        <Column
          title="状态"
          dataIndex="delFlag"
          render={t => (t === 0 ? '在职' : t === 1 ? '离职' : '')}
        />
        <Column title="身份证号" dataIndex="idcardNo" />
        <Column title="电子邮件" dataIndex="email" />
        <Column title="手机号码" dataIndex="phonenum" />
        <Column title="职位" dataIndex="jobName" />
        <Column title="部门" dataIndex="deptName" />
        <Column title="创建时间" dataIndex="createTime" />
      </Table>
    </div>
  );
};
export default connect(({ employee, loading }) => ({
  employee,
  loading: loading.models.employee,
}))(Form.create()(RightTable));
