import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
class AddModal extends Component {
  addConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        onOk(values);
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
        title="新增"
        visible={visible}
        onOk={this.addConfirm}
        onCancel={this.addCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="批次名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入批次名称',
                },
              ],
            })(<Input style={{ width: '300px' }} />)}
          </FormItem>
          <FormItem label="订单总量">
            {getFieldDecorator('orderCount', {
              rules: [
                {
                  required: true,
                  message: '请输入订单总量',
                },
              ],
            })(<InputNumber style={{ width: '150px' }} min={1} />)}
          </FormItem>
          <FormItem label="订单金额">
            {getFieldDecorator('orderPrice', {
              rules: [
                {
                  required: true,
                  message: '请输入订单金额',
                },
              ],
            })(<InputNumber style={{ width: '150px' }} suffix="元" min={1} />)}
          </FormItem>
          <FormItem label="下单日期">
            {getFieldDecorator('orderDate', {
              rules: [
                {
                  required: true,
                  message: '请选择下单日期',
                },
              ],
            })(<DatePicker showTime style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '请输入备注',
                },
                {
                  validator: this.limitString,
                },
              ],
            })(<TextArea style={{ width: '300px', resize: 'none' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default AddModal;
