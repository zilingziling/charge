import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const ml = {
  marginLeft: '13px',
};
@Form.create({
  mapPropsToFields(props) {
    if (props.recallData) {
      return {
        oldDeviceId: Form.createFormField({
          value: props.recallData.id,
        }),
      };
    }
  },
})
class ReplaceModal extends Component {
  addConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        onOk(values);
        this.props.form.resetFields();
      }
    });
  };
  addCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.props.form.resetFields();
  };
  //输入字符验证
  limitString = (rule, value, callback) => {
    if (value) {
      if (value.length > 50) {
        callback('最多可输入50个字符!');
      }
    }
    callback();
  };
  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="替换"
        visible={visible}
        onOk={this.addConfirm}
        onCancel={this.addCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="原设备编号" style={{ marginLeft: 10 }}>
            {getFieldDecorator('oldDeviceId')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="新设备编号">
            {getFieldDecorator('newDeviceId', {
              rules: [
                {
                  required: true,
                  message: '请输入新设备编号',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="替换原因" style={ml}>
            {getFieldDecorator('reason', {
              rules: [
                {
                  required: true,
                  message: '请输入替换原因',
                },
                {
                  validator: this.limitString,
                },
              ],
            })(<TextArea style={{ width: 380, resize: 'none' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ReplaceModal;
