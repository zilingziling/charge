import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TreeSelect, message, Radio, Select } from 'antd';
import { formatTreeData, idCardValidator, mobileValidator } from '@/utils/handleNumber';
import { connect } from 'dva';
import { addTree, getGender, getPosTree, opeEmp } from '@/services/systemManage/employee';
const w300 = {
  width: 300,
};
const FormItem = Form.Item;
const Option = Select.Option;
const AddTree = ({
  visible,
  onOk,
  onClose,
  title,
  form,
  employee,
  dispatch,
  edit,
  setEdit,
  info,
  selectOrg,
}) => {
  const { getFieldDecorator, validateFields, resetFields } = form;
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
        if (title === '新增') {
          addTree({
            ...v,
            pid: selectOrg || 0,
            // myOrgId: selectOrg,
          }).then(r => {
            handleResult(r);
          });
        } else if (title === '编辑') {
          addTree({
            ...v,
            pid: info.pid ? info.pid : 0,
            myOrgId: selectOrg,
          }).then(r => {
            handleResult(r);
          });
        }
      }
    });
  };
  const handleClose = () => {
    onClose();
    setEdit({});
  };
  return (
    <Modal title={title} visible={visible} onCancel={handleClose} onOk={confirmModal}>
      <Form layout="inline">
        <FormItem label="组织名称">
          {getFieldDecorator('fullName', {
            rules: [
              {
                required: true,
                message: '请输入组织名称',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入组织名称" style={w300} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create({
  mapPropsToFields(props) {
    return {
      fullName: Form.createFormField({
        value: props.edit.fullName,
      }),
    };
  },
})(
  connect(({ employee }) => ({
    employee,
  }))(AddTree)
);
