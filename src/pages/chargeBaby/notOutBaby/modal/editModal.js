import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber, Radio } from 'antd';
const FormItem = Form.Item;

@Form.create({
  mapPropsToFields(props) {
    if (props.editInfo) {
      return {
        newId: Form.createFormField({
          value: props.editInfo.terminalId,
        }),
      };
    }
  },
})
class EditModal extends Component {
  editConfirm = () => {
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
  editCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.props.form.resetFields();
  };

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="编辑"
        visible={visible}
        onOk={this.editConfirm}
        onCancel={this.editCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="小宝编号">
            {getFieldDecorator('newId', {
              rules: [
                {
                  required: true,
                  message: '请输入小宝编号',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
