import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TreeSelect, message } from 'antd';
import { addDic, addType, editDic, editType, getSubTree } from '@/services/systemManage/dictionary';
import { formatTreeData, limitName20, notChinese } from '@/utils/handleNumber';
const FormItem = Form.Item;
const w300 = {
  width: 300,
};
const AddDic = ({
  form,
  visible,
  onOk,
  onClose,
  setEdit,
  edit,
  title,
  treeData,
  typeInfo,
  selectDic,
  setTreeData,
}) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleResult = r => {
    if (r.code === '000000') {
      message.success('操作成功');
      resetFields();
      onOk();
      setEdit({});
      getSubTree({
        dict_type_id: typeInfo.typeId,
        // pid: selectDic ? selectDic : null,
      }).then(r => {
        formatTreeData(r.data, 'dictId');
        setTreeData(r.data);
      });
    } else message.error(`操作失败:${r.msg}`, 6);
  };
  const dicProps = {
    treeData,
    searchPlaceholder: '请选择上级字典',
    style: {
      width: 300,
    },
    dropdownStyle: {
      height: 200,
      overflowY: 'auto',
    },
  };
  const confirmModal = () => {
    validateFields((e, v) => {
      if (!e) {
        if (title === '新增')
          addDic({
            ...v,
            dictTypeId: typeInfo.typeId,
            parentId: selectDic ? selectDic : 0,
          }).then(r => {
            handleResult(r);
          });
        else if (title === '编辑')
          editDic({
            ...v,
            dictTypeId: typeInfo.typeId,
            dictId: edit.dictId,
            parentId: selectDic,
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
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };
  return (
    <Modal title={title} visible={visible} onOk={confirmModal} onCancel={handleClose}>
      <Form {...formItemLayout}>
        {typeInfo.typeName ? (
          <FormItem label="类型名称">
            {getFieldDecorator('typeName')(<Input disabled style={w300} />)}
          </FormItem>
        ) : null}
        <FormItem label="字典名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入字典名称',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入字典名称" style={w300} />)}
        </FormItem>
        <FormItem label="字典编码">
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: '请输入字典编码',
              },
              {
                validator: notChinese,
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入字典编码" style={w300} />)}
        </FormItem>
        <FormItem label="上级字典">
          {getFieldDecorator('parentId')(<TreeSelect {...dicProps} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};
export default Form.create({
  mapPropsToFields(props) {
    return {
      typeName: Form.createFormField({
        value: props.typeInfo.typeName,
      }),
      name: Form.createFormField({
        value: props.edit.name,
      }),
      parentId: Form.createFormField({
        value: props.edit.parentId,
      }),
      code: Form.createFormField({
        value: props.edit.code,
      }),
    };
  },
})(AddDic);
