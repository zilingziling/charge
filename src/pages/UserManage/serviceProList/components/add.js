import React, { Component } from 'react';
import { Button, Card, Radio, Form, Input, Select, TimePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const Option = Select.Option;
const w350 = {
  width: 350,
};
const mr20 = {
  marginRight: 20,
};

const Add = ({ form }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form>
          <FormItem label="服务商类型">
            {getFieldDecorator('keywords')(
              <Radio.Group style={w350} placeholder="请选择">
                <Radio value={1}>个人</Radio>
                <Radio value={2}>企业</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="联系人">
            {getFieldDecorator('mobile')(
              <Input allowClear style={w350} placeholder="输入联系人" />
            )}
          </FormItem>

          <FormItem label="联系方式">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  validator: mobileValidator,
                },
              ],
            })(<Input allowClear style={w350} placeholder="输入手机号" />)}
          </FormItem>
          <FormItem label="企业名称">
            {getFieldDecorator('mobile')(
              <Input allowClear style={w350} placeholder="输入企业名称" />
            )}
          </FormItem>
          <FormItem label="负责区域">
            {getFieldDecorator('startTime', {
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(<Input style={w350} />)}
          </FormItem>
          <FormItem>
            <Button type="primary">保存</Button>
            <Button type="danger">返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default Form.create({})(Add);
