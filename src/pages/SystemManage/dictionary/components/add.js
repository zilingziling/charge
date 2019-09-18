import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { addType, editType } from '@/services/systemManage/dictionary';
import { limitName20, notChinese } from '@/utils/handleNumber';
const FormItem = Form.Item;
const w300 = {
  width: 300,
};
const AddType = ({ form, typeV, onOk, onClose, setEdit, edit, title }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleResult = r => {
    if (r.code === '000000') {
      message.success('操作成功');
      resetFields();
      onOk();
      setEdit({});
    } else message.error(`操作失败:${r.msg}`, 6);
  };
  const confirmModal = () => {
    validateFields((e, v) => {
      if (!e) {
        if (title === '新增')
          addType({
            ...v,
          }).then(r => {
            handleResult(r);
          });
        else if (title === '编辑')
          editType({
            ...v,
            id: edit.dictTypeId,
          }).then(r => {
            handleResult(r);
          });
      }
    });
  };
  const handleClose = () => {
    onClose();
    setEdit({});
  };
  return (
    <Modal title={title} visible={typeV} onOk={confirmModal} onCancel={handleClose}>
      <Form layout="inline">
        <FormItem label="类型名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入类型名称',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入类型名称" style={w300} />)}
        </FormItem>
        <FormItem label="类型编码">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入类型编码',
              },
              {
                validator: notChinese,
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入类型编码" style={w300} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};
export default Form.create({
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.edit.name,
      }),
      code: Form.createFormField({
        value: props.edit.code,
      }),
    };
  },
})(AddType);
