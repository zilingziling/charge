import React, { Component } from 'react';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};

const Search = ({ form, setSearch, setPage }) => {
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
          <FormItem label="时间">
            {getFieldDecorator('staTime')(<DatePicker placeholder="请选择开始时间" />)}
          </FormItem>
          <FormItem>
            <Input
              style={{
                width: 30,
                pointerEvents: 'none',
                backgroundColor: '#fff',
              }}
              placeholder="~"
              disabled
            />
          </FormItem>
          <FormItem>
            {getFieldDecorator('endTime')(<DatePicker placeholder="请选择结束时间" />)}
          </FormItem>
          <FormItem label="用户名">
            {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
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

export default Form.create({})(Search);
