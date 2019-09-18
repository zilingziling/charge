import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
@Form.create({
  mapPropsToFields(props) {
    return {
      id: Form.createFormField({
        value: props.scrapInfo.deviceId,
      }),
    };
  },
})
class ScrapModal extends Component {
  scrapConfirm = () => {
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
  scrapCancel = () => {
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
        title="设备报废"
        visible={visible}
        onOk={this.scrapConfirm}
        onCancel={this.scrapCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="设备编号" style={{ marginLeft: '11px' }}>
            {getFieldDecorator('id')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="报废原因">
            {getFieldDecorator('details', {
              rules: [
                {
                  required: true,
                  message: '请输入报废原因',
                },
                {
                  validator: this.limitString,
                },
              ],
            })(<TextArea style={{ width: '250px', resize: 'none' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ScrapModal;
