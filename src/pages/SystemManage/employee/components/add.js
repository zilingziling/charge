import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, TreeSelect, message, Radio, Select, Cascader } from 'antd';
import {
  formatTreeData,
  formItemLayout,
  idCardValidator,
  mobileValidator,
  onlyNumber,
} from '@/utils/handleNumber';
import { connect } from 'dva';
import { getGender, getPosTree, opeEmp } from '@/services/systemManage/employee';
const w300 = {
  width: 400,
};
const treeStyle = {
  height: 200,
};
const FormItem = Form.Item;
const Option = Select.Option;
const Add = ({
  visible,
  onOk,
  onClose,
  title,
  form,
  employee,
  dispatch,
  edit,
  setEdit,
  initData,
}) => {
  const { getFieldDecorator, validateFields, resetFields } = form;
  const { depData, posData } = employee;
  const [gender, setG] = useState([]);
  const [init, setInit] = useState(1);
  const [area, setArea] = useState([]);
  useEffect(() => {
    getGender({ codes: 'sex' }).then(r => {
      formatTreeData(r.data.SEX.dicts, 'dictId', ['name', 'code']);
      setG(r.data.SEX.dicts);
      setInit(r.data.SEX.dicts[0].code);
    });
    getPosTree({ pid: 0 }).then(r => {
      formatTreeData(r.data, 'jobId');
      dispatch({
        type: 'employee/savePosData',
        payload: { posData: r.data },
      });
    });
    getGender({ codes: 'area' }).then(r => {
      formatTreeData(r.data.area.dicts, 'dictId');
      setArea(r.data.area.dicts);
    });
  }, []);
  const depProps = {
    treeData: depData,
    treeDefaultExpandAll: true,
    searchPlaceholder: '请选择部门',
    style: {
      width: 400,
    },
    dropdownStyle: {
      height: 200,
      overflowY: 'auto',
    },
  };
  const posProps = {
    treeData: posData,
    treeDefaultExpandAll: true,
    searchPlaceholder: '请选择职位',
    style: {
      width: 400,
    },
    dropdownStyle: {
      height: 200,
      overflowY: 'auto',
    },
  };
  const confirmModal = () => {
    validateFields((e, v) => {
      if (!e) {
        opeEmp({
          ...v,
          staffId: edit.staffId ? edit.staffId : null,
        }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            resetFields();
            onOk();
            setEdit({});
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
  const handleClose = () => {
    onClose();
    setEdit({});
  };
  const changeNum = title === '编辑';
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
    <Modal width={700} title={title} visible={visible} onCancel={handleClose} onOk={confirmModal}>
      <Form {...formItemLayout}>
        {changeNum && (
          <FormItem label="员工工号">
            {getFieldDecorator('staffId')(<Input disabled={changeNum} style={w300} />)}
          </FormItem>
        )}
        <FormItem label="姓名">
          {getFieldDecorator('staffName', {
            rules: [
              {
                required: true,
                message: '请输入姓名',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入姓名" style={w300} />)}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('sex', {
            initialValue: gender[0] && gender[0].code,
            rules: [
              {
                required: true,
                message: '请选择性别',
              },
            ],
          })(
            <Radio.Group>
              {gender.map(item => (
                <Radio key={item.key} value={item.code}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="身份证号">
          {getFieldDecorator('idCardNo', {
            rules: [
              {
                required: true,
                message: '请输入身份证号',
              },
              {
                validator: idCardValidator,
              },
            ],
          })(<Input placeholder="请输入身份证号" style={w300} />)}
        </FormItem>
        <FormItem label="所在地区">
          {getFieldDecorator('area', {
            rules: [
              {
                required: true,
                message: '请输入所在地区',
              },
            ],
          })(<Cascader options={area} placeholder="请选择所在地区" style={w300} />)}
        </FormItem>
        <FormItem label="状态">
          {getFieldDecorator('delFlag', {
            rules: [
              {
                required: true,
                message: '请选择状态',
              },
            ],
          })(
            <Radio.Group>
              <Radio key={0} value={0}>
                在职
              </Radio>
              <Radio key={1} value={1}>
                离职
              </Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="电子邮件">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                required: true,
                message: '请输入正确的电子邮件',
              },
            ],
          })(<Input placeholder="请输入电子邮件" style={w300} />)}
        </FormItem>
        <FormItem label="手机号码">
          {getFieldDecorator('phonenum', {
            rules: [
              {
                required: true,
                message: '请输入手机号码',
              },
              {
                validator: mobileValidator,
              },
            ],
          })(<Input placeholder="请输入手机号码" style={w300} />)}
        </FormItem>
        <FormItem label="职位">
          {getFieldDecorator('jobId', {
            rules: [
              {
                required: true,
                message: '请选择职位',
              },
            ],
          })(<TreeSelect {...posProps} />)}
        </FormItem>
        <FormItem label="部门">
          {getFieldDecorator('orgId', {
            rules: [
              {
                required: true,
                message: '请选择部门',
              },
            ],
          })(<TreeSelect {...depProps} />)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create({
  mapPropsToFields(props) {
    return {
      staffId: Form.createFormField({
        value: props.edit.staffNo,
      }),
      staffName: Form.createFormField({
        value: props.edit.staffName,
      }),
      email: Form.createFormField({
        value: props.edit.email,
      }),
      phonenum: Form.createFormField({
        value: props.edit.phonenum,
      }),
      area: Form.createFormField({
        value: props.edit.area && JSON.parse(props.edit.area),
      }),
      jobId: Form.createFormField({
        value: props.edit.jobId,
      }),
      orgId: Form.createFormField({
        value: props.edit.deptId,
      }),
      idCardNo: Form.createFormField({
        value: props.edit.idcardNo,
      }),
      delFlag: Form.createFormField({
        value: props.edit.delFlag,
      }),
    };
  },
})(
  connect(({ employee }) => ({
    employee,
  }))(Add)
);
