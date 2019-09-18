import React, { Component } from 'react';
import { Button, Card, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
const FormItem = Form.Item;
const w150 = {
  width: 150,
};
const Search = ({ form, setSearch, setPage }) => {
  const { getFieldDecorator, validateFields, resetFields } = form;
  const handleSearch = () => {
    validateFields(['roleName'], (err, v) => {
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
          <FormItem label="角色名称">
            {getFieldDecorator('roleName')(<Input placeholder="请输入角色名称" style={w150} />)}
          </FormItem>
          <Button icon="search" type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button icon="reload" type="primary" onClick={handleReset}>
            重置
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(connect(({ systemM }) => ({ systemM }))(Search));
