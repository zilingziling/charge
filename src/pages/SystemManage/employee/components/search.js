import React, { Component, useState } from 'react';
import { Button, Card, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator } from '@/utils/handleNumber';
import Add from '@/pages/SystemManage/employee/components/add';
import { connect } from 'dva';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};
const mr20 = {
  marginRight: 20,
};

const Search = ({ form, handleAdd, reset, setPage, setSearch }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleSearch = () => {
    validateFields((err, v) => {
      if (!err) {
        setSearch({ ...v });
        setPage(1);
      }
    });
  };
  const handleReset = () => {
    setSearch({});
    setPage(1);
    resetFields();
  };
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="员工姓名">
            {getFieldDecorator('name')(<Input placeholder="请输入员工姓名" style={w150} />)}
          </FormItem>
          <FormItem label="手机号码">
            {getFieldDecorator('phonenum', {
              rules: [
                {
                  validator: mobileValidator,
                },
              ],
            })(<Input placeholder="请输入手机号码" style={w150} />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20} onClick={handleSearch}>
              搜索
            </Button>
            <Button type="primary" onClick={handleAdd} style={mr20}>
              新增
            </Button>
            <Button icon="reload" type="primary" onClick={handleReset}>
              重置
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(
  connect(({ employee }) => ({
    employee,
  }))(Search)
);
