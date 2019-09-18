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
          <FormItem label="仓库名称">
            {getFieldDecorator('name')(<Input placeholder="请输入发货仓库" style={w150} />)}
          </FormItem>
          <FormItem label="设备编号">
            {getFieldDecorator('name')(<Input placeholder="请输入仓库名称" style={w150} />)}
          </FormItem>
          <FormItem label="设备类型">
            {getFieldDecorator('area')(
              <Select placeholder="请选择设备类型" style={w150}>
                <Option value={0}>充电宝</Option>
                <Option value={1}>充电线</Option>
                <Option value={2}>6口设备</Option>
                <Option value={3}>12设备</Option>
                <Option value={4}>机柜</Option>
                <Option value={5}>广告屏（3128）</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="设备供应商">
            {getFieldDecorator('area')(
              <Select placeholder="请选择设备供应商" style={w150}>
                <Option value={0}>a</Option>
                <Option value={1}>b</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="记录类型">
            {getFieldDecorator('name')(
              <Select style={w150}>
                <Option value={1}>标记良品</Option>
                <Option value={2}>标记不良品</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="时间">
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
