import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class PersonalModal extends Component {
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
    const { visible, type } = this.props;
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
          <FormItem label="代理类型">
            {getFieldDecorator('userType', {
              initialValue: type && type === 1 ? 1 : 0,
              rules: [
                {
                  required: true,
                  message: '请选择代理类型',
                },
              ],
            })(
              <Select style={{ width: '150px' }} disabled>
                <Option value={0}>个人</Option>
                <Option value={1}>企业</Option>
              </Select>
            )}
          </FormItem>
          {type && type === 1 ? (
            <FormItem label="企业名称">
              {getFieldDecorator('companyName', {
                rules: [
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                ],
              })(<Input style={{ width: '150px' }} />)}
            </FormItem>
          ) : null}
          <FormItem label="联系人">
            {getFieldDecorator('realName', {
              rules: [
                {
                  required: true,
                  message: '请输入联系人',
                },
              ],
            })(<Input style={{ width: '150px', marginLeft: '14px' }} />)}
          </FormItem>
          <FormItem label="联系方式">
            {getFieldDecorator('mobile', {
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
          <FormItem label="负责区域">
            {getFieldDecorator('area', {
              rules: [
                {
                  required: true,
                  message: '请输入负责区域',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default PersonalModal;
