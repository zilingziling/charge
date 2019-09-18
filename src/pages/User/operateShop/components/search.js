import React, { Component } from 'react';
import { Button, Card, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};

const Search = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="商户联系方式">
            {getFieldDecorator('userType', {
              rules: [{ validator: mobileValidator }],
            })(<Input placeholder="请输入联系方式" style={w150} />)}
          </FormItem>
          <FormItem label="商户状态">
            {getFieldDecorator('userState')(
              <Select style={{ width: '150px' }}>
                <Option value={0}>未关联</Option>
                <Option value={1}>已关联</Option>
              </Select>
            )}
          </FormItem>
          <Button icon="search" type="primary">
            搜索
          </Button>
          <Button type="danger">重置</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(Search);
