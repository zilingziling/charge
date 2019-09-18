import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create({
  mapPropsToFields(props) {
    if (props.info) {
      return {
        userType: Form.createFormField({
          value: props.info.userType,
        }),
        realname: Form.createFormField({
          value: props.info.realname,
        }),
        mobile: Form.createFormField({
          value: props.info.mobile,
        }),
        area: Form.createFormField({
          value: props.info.area,
        }),
        level: Form.createFormField({
          value: props.info.level,
        }),
        reward: Form.createFormField({
          value: props.info.reward + '%',
        }),
        companyName: Form.createFormField({
          value: props.info.companyName,
        }),
      };
    }
  },
})
class EditModal extends Component {
  state = {
    selectType: '',
  };
  editConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        if (values.reward.includes('%')) {
          values.reward = values.reward.substr(0, values.reward.length - 1);
        }
        onOk(values);
        this.props.form.resetFields();
      }
    });
  };
  editCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      selectType: null,
    });
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
  handleSelectType = v => {
    this.setState({
      selectType: v,
    });
  };
  render() {
    const { selectType } = this.state;
    const { visible, info } = this.props;
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
          <FormItem label="代理类型">
            {getFieldDecorator('userType', {
              rules: [
                {
                  required: true,
                  message: '请选择代理类型',
                },
              ],
            })(
              <Select style={{ width: '150px' }} onSelect={this.handleSelectType}>
                <Option value={0}>个人</Option>
                <Option value={1}>企业</Option>
                <Option value={-1}>无</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="代理等级">
            {getFieldDecorator('level')(
              <Select style={{ width: '150px' }} disabled>
                <Option value={1}>总代理</Option>
                <Option value={2}>1级代理</Option>
                <Option value={3}>2级代理</Option>
                <Option value={4}>3级代理</Option>
                <Option value={-1}>无</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="联系人">
            {getFieldDecorator('realname', {
              rules: [
                {
                  required: true,
                  message: '请输入联系人',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
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
          {info.userType === 1 ? (
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
          <FormItem label="分润比例">
            {getFieldDecorator('reward', {
              rules: [
                {
                  required: true,
                  message: '请输入分润比例',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          {selectType === 1 ? (
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
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
