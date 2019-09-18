import React, { Component } from 'react';
import { Button, Card, Form, Input, Select } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator } from '@/utils/handleNumber';
const FormItem = Form.Item;
const TextArea=Input.TextArea
const w300={
  width:300
}

const Add = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form >
          <FormItem label="标题">
           <Input placeholder="请输入电话号码"  style={w300}/>
          </FormItem>
          <FormItem label="内容">
            {getFieldDecorator('userState')(
                <TextArea placeholder='请输入内容' style={w300}/>
            )}
          </FormItem>
        </Form>
        <Button  type="primary">
          保存
        </Button>
        <Button type="danger">返回</Button>
      </Card>
    </div>
  );
};

export default Form.create({})(Add);
