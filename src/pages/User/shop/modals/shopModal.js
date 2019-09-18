import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, TimePicker } from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const format = 'HH:mm';
@Form.create({
  mapPropsToFields(props) {
    if (props.info) {
      let timeArr = [];
      if (props.info.openTime) {
        timeArr = props.info.openTime.split('-');
      }
      return {
        sellerName: Form.createFormField({
          value: props.info.name,
        }),
        linkMan: Form.createFormField({
          value: props.info.linkman,
        }),
        phone: Form.createFormField({
          value: props.info.linktel,
        }),
        address: Form.createFormField({
          value: props.info.address,
        }),
        personCost: Form.createFormField({
          value: props.info.personCost,
        }),
        startTime: Form.createFormField({
          value: timeArr.length > 0 ? moment(`${timeArr[0]}`, 'HH:mm') : null,
        }),
        endTime: Form.createFormField({
          value: timeArr.length > 0 ? moment(`${timeArr[1]}`, 'HH:mm') : null,
        }),
      };
    }
  },
})
class ShopModal extends Component {
  handleConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        let openTime = `${moment(values.startTime).format('HH:mm')}-${moment(values.endTime).format(
          'HH:mm'
        )}`;
        delete values.startTime;
        delete values.endTime;
        onOk({ ...values, openTime });
        this.props.form.resetFields();
      }
    });
  };
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.props.form.resetFields();
  };
  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    if (value) {
      const reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码');
      }
    }
    callback();
  };
  render() {
    const { visible, info } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title={info.type === 'add' ? '新增' : info.type === 'edit' ? '编辑' : ''}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={this.handleCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="商户名称">
            {getFieldDecorator('sellerName', {
              rules: [
                {
                  required: true,
                  message: '请输入商户名称',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="联系人">
            {getFieldDecorator('linkMan', {
              rules: [
                {
                  required: true,
                  message: '请输入联系人',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="联系方式">
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: '请输入电话号码',
                },
                {
                  validator: this.mobileValidator,
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <div>
            <FormItem label="营业时间">
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择开始时间',
                  },
                ],
              })(<TimePicker format={format} />)}
            </FormItem>
            <FormItem>
              <Input
                style={{
                  width: 30,
                  pointerEvents: 'none',
                  backgroundColor: '#fff',
                }}
                placeholder="~"
                disabled
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择结束时间',
                  },
                ],
              })(<TimePicker format={format} />)}
            </FormItem>
          </div>
          <FormItem label="人均消费">
            {getFieldDecorator('personCost', {
              rules: [
                {
                  required: true,
                  message: '请输入人均消费',
                },
              ],
            })(<Input style={{ width: '150px' }} suffix="元/人" />)}
          </FormItem>
          <FormItem label="详细地址">
            {getFieldDecorator('address', {
              rules: [
                {
                  required: true,
                  message: '请输入详细地址',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ShopModal;
