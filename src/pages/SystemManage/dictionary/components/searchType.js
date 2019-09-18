import React, { Component } from 'react';
import { Button, Card, Divider, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};
const mr20 = {
  marginRight: 20,
};

const SearchType = ({ form, setTypeV, setSearch, setPage, setTitle }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleAdd = () => {
    setTitle('新增');
    setTypeV(true);
  };
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
          <FormItem label="类型名称">
            {getFieldDecorator('keywords')(<Input placeholder="请输入类型名称" style={w150} />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon="reload" type="primary" style={mr20} onClick={handleReset}>
              重置
            </Button>
            <Button icon="plus" type="primary" style={mr20} onClick={handleAdd}>
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(SearchType);
