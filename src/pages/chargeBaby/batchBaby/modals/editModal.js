import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { formatMoney } from '@/utils/handleNumber';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create({
  mapPropsToFields(props) {
    if (props.editData.batchName) {
      return {
        name: Form.createFormField({
          value: props.editData.batchName,
        }),
        orderCount: Form.createFormField({
          value: props.editData.orderNum,
        }),
        orderPrice: Form.createFormField({
          value: formatMoney(props.editData.orderMoney),
        }),
        orderDate: Form.createFormField({
          value: moment(props.editData.orderDate),
        }),
        description: Form.createFormField({
          value: props.editData.details,
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
        title="编辑"
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
            })(<Input style={{ width: '150px' }} />)}
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

export default EditModal;
