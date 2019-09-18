import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create({
  mapPropsToFields(props) {
    if (props.recallData) {
      return {
        boxId: Form.createFormField({
          value: props.recallData.id,
        }),
      };
    }
  },
})
class RecallModal extends Component {
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
        title="撤回"
        visible={visible}
        onOk={this.addConfirm}
        onCancel={this.addCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="设备编号" style={{ marginLeft: 10 }}>
            {getFieldDecorator('boxId')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="撤回原因">
            {getFieldDecorator('reason', {
              rules: [
                {
                  required: true,
                  message: '请输入撤回原因',
                },
                {
                  validator: this.limitString,
                },
              ],
            })(<TextArea style={{ width: 400, resize: 'none' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default RecallModal;
