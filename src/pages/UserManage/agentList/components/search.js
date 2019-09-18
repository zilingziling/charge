import React, { Component } from 'react';
import { Button, Card, Col, Divider, Form, Input, Row, Select, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { formatterTime, mobileValidator } from '@/utils/handleNumber';
import { resetStyle, searchBtn } from '@/utils/cssStyle';
import searchForm from '@/pages/searchForm.less';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 236,
};
const mr20 = {
  marginRight: 20,
};

const Search = ({ form, setP, setSearch }) => {
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
      <Card className={styles.searchBar}>
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={8}>
              <FormItem label="代理等级">
                {getFieldDecorator('agentLevel')(
                  <Select placeholder="请选择">
                    <Option value={1}>总代理</Option>
                    <Option value={2}>一级代理</Option>
                    <Option value={3}>二级代理</Option>
                    <Option value={4}>三级代理</Option>
                    <Option value={""}>全部</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="代理联系方式">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      validator: mobileValidator,
                    },
                  ],
                })(<Input allowClear placeholder="输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={8} className={searchForm.time}>
              <FormItem label="创建时间">{getFieldDecorator('startTime')(<DatePicker />)}</FormItem>
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
              <FormItem>{getFieldDecorator('endTime')(<DatePicker />)}</FormItem>
            </Col>
          </Form>
        </Row>
        <Row >
          <Col span={24} style={searchBtn}>
            <Button icon="search" type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button icon="reload"  onClick={handleReset} style={resetStyle}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Form.create({})(Search);
