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
          <FormItem label="状态">
            {getFieldDecorator('userType', {
              rules: [{ validator: mobileValidator }],
            })(
              <Select style={w150}>
                <Option value={0}>全部</Option>
                <Option value={1}>已发送</Option>
                <Option value={2}>未发送</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="标题">
            {getFieldDecorator('userState')(<Input placeholder="请输入标题" style={w150} />)}
          </FormItem>
          <Button icon="search" type="primary">
            搜索
          </Button>
          <Button icon="reload" type="primary">
            重置
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(Search);
