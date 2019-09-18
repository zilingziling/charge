import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Cascader, Form, Input } from 'antd';
const FormItem = Form.Item;
const mr20 = {
  marginRight: 20,
};
const w150 = {
  width: 150,
};

const Search = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="总代理名称">
            {getFieldDecorator('name')(<Input placeholder="请输入总代理名称" style={w150} />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20}>
              搜索
            </Button>
            <Button icon="reload" type="primary">
              重置
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};
export default Form.create()(Search);
