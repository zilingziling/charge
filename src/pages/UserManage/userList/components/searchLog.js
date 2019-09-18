import React, { Component, useState } from 'react';
import { Button, Card, Divider, Form, Input, Select, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { resetStyle, w150 } from '@/utils/cssStyle';
import { formatterTime, mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const Option = Select.Option;

const mr20 = {
  marginRight: 20,
};

const SearchLog = ({ form,setSearch,setP }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleSearch = () => {
    validateFields((err, v) => {
      if (!err) {
        if (v.startTime) {
          v.startTime=formatterTime(v.startTime);
        }
        if (v.endTime) {
          v.endTime= formatterTime(v.endTime);
        }
        setSearch({ ...v });
        setP(1);
      }
    });
  };
  const handleReset = () => {
    setSearch({});
    setP(1);
    resetFields();
  };
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar} bordered={false}>
        <Form layout="inline">
          <FormItem label="日志类型">
            {getFieldDecorator('logType')(
              <Select style={w150} placeholder="请选择">
                <Option value={1}>租借</Option>
                <Option value={2}>归还</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="发生时间">
            {getFieldDecorator('startTime')(<DatePicker style={w150}/>)}
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
            {getFieldDecorator('endTime')(<DatePicker style={w150}/>)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20} onClick={handleSearch}>
              搜索
            </Button>
            <Button
              icon="reload"
              style={resetStyle}
              onClick={handleReset}
            >
              重置
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(SearchLog);
