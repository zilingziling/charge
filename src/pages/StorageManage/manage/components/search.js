import React from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, Input } from 'antd';
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
          <FormItem label="仓库名称">
            {getFieldDecorator('name')(<Input placeholder="请输入仓库名称" style={w150} />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20}>
              搜索
            </Button>
            <Button type="primary" style={mr20}>
              新增
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
