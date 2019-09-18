import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Select, Form, Input, DatePicker } from 'antd';
import { mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const Option = Select.Option;
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
          <FormItem label="状态">
            {getFieldDecorator('area')(
              <Select placeholder="请选择状态" style={w150}>
                <Option value={0}>待初审</Option>
                <Option value={1}>待复审</Option>
                <Option value={2}>待收货</Option>
                <Option value={4}>已完成</Option>
                <Option value={5}>已拒绝</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="退货仓库">
            {getFieldDecorator('name')(<Input placeholder="请输入补货仓库" style={w150} />)}
          </FormItem>
          <FormItem label="收货仓库">
            {getFieldDecorator('name')(<Input placeholder="请输入发货仓库" style={w150} />)}
          </FormItem>
          <FormItem label="申请时间">
            {getFieldDecorator('startTime', {
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(<DatePicker />)}
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
            })(<DatePicker />)}
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
