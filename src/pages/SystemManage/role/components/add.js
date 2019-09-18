import React, { Component } from 'react';
import { Button, Card, Form, Input, Select, message } from 'antd';
import styles from '@/pages/mylayout.less';
import { mobileValidator, notChinese, onlyNumber } from '@/utils/handleNumber';
import { addRole } from '@/services/systemManage/systemManage';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const w300 = {
  width: 300,
};

const Add = ({ form, initData, setKey, setEdit, edit }) => {
  const { getFieldDecorator, validateFields, resetFields } = form;

  const handleAdd = () => {
    validateFields(['name', 'roleCode', 'sort'], (e, v) => {
      if (!e) {
        addRole({ ...v, roleId: edit.roleId ? edit.roleId : null }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            initData();
            setKey('1');
            resetFields();
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
  const handleReturn = () => {
    setKey('1');
    setEdit({});
    resetFields();
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 22 },
    },
  };
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form>
          <FormItem label="角色名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入角色名称',
                },
                {
                  max: 20,
                  message: '长度不能超过20！',
                },
              ],
            })(<Input placeholder="请输入角色名称" style={w300} />)}
          </FormItem>
          <FormItem label="角色编码">
            {getFieldDecorator('roleCode', {
              rules: [
                {
                  required: true,
                  message: '请输入角色编码',
                },
                {
                  validator: notChinese,
                },
                {
                  max: 20,
                  message: '长度不能超过20！',
                },
              ],
            })(<Input placeholder="请输入角色编码" style={w300} />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('sort', {
              rules: [
                {
                  required: true,
                  message: '请输入排序',
                },
                {
                  validator: onlyNumber,
                },
                {
                  max: 20,
                  message: '长度不能超过20！',
                },
              ],
            })(<Input placeholder="请输入排序" style={w300} />)}
          </FormItem>
        </Form>
        <Button type="primary" onClick={handleAdd}>
          保存
        </Button>
        <Button type="danger" onClick={handleReturn}>
          返回
        </Button>
      </Card>
    </div>
  );
};

export default Form.create({
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.edit.name,
      }),
      roleCode: Form.createFormField({
        value: props.edit.roleCode,
      }),
      sort: Form.createFormField({
        value: props.edit.sort,
      }),
    };
  },
})(Add);
