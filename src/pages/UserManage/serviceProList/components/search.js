import React, { Component } from 'react';
import { Button, Card, Divider, Form, Input, Select, TimePicker } from 'antd';
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

const Search = ({ form }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="服务商等级">
            {getFieldDecorator('keywords')(
              <Select style={w150} placeholder="请选择">
                <Option value={1}>总代理</Option>
                <Option value={2}>一级代理</Option>
                <Option value={3}>二级代理</Option>
                <Option value={2}>三级代理</Option>
                <Option value={3}>全部</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="服务商联系方式">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  validator: mobileValidator,
                },
              ],
            })(<Input allowClear style={w150} placeholder="输入手机号" />)}
          </FormItem>
          <FormItem label="创建时间">
            {getFieldDecorator('startTime', {
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(<TimePicker />)}
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
            {getFieldDecorator('endTime', {
              rules: [
                {
                  required: true,
                  message: '请选择结束时间',
                },
              ],
            })(<TimePicker />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20}>
              搜索
            </Button>
            <Button icon="reload" type="primary" style={mr20}>
              重置
            </Button>
            <Button icon="plus" type="primary" style={mr20}>
              新增
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(Search);
