import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create({
  mapPropsToFields(props) {
    if (props.editInfo.deviceType) {
      return {
        deviceType: Form.createFormField({
          value: props.editInfo.deviceType,
        }),
        updateId: Form.createFormField({
          value: props.editInfo.deviceId,
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
          <FormItem label="设备类型">
            {getFieldDecorator('deviceType', {
              rules: [
                {
                  required: true,
                  message: '请选择设备类型',
                },
              ],
            })(
              <RadioGroup>
                <Radio value={6}>6口5台</Radio>
                <Radio value={12}>12口11台</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="设备编号">
            {getFieldDecorator('updateId', {
              rules: [
                {
                  required: true,
                  message: '请输入设备编号',
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
