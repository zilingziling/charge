import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create({
  mapPropsToFields(props) {
    if (props.editData.expressNo) {
      return {
        expressNo: Form.createFormField({
          value: props.editData.expressNo,
        }),
      };
    }
  },
})
class EditModal extends Component {
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

  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="编辑"
        visible={visible}
        onOk={this.addConfirm}
        onCancel={this.addCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="快递单号">
            {getFieldDecorator('expressNo', {
              rules: [
                {
                  required: true,
                  message: '请输入快递单号',
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
