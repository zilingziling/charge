import React, { Component } from 'react';
import { Modal, Radio, Select, Input, Form, message, Table } from 'antd';
import { connect } from 'dva';
import { getAgentByPhone } from '@/services/userManage';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create({
  mapPropsToFields(props) {
    if (props.info) {
      return {
        realname: Form.createFormField({
          value: props.info.realname,
        }),
        mobile: Form.createFormField({
          value: props.info.mobile,
        }),
      };
    }
  },
})
class AssociateModal extends Component {
  state = {
    type: '',
    assignPercent: '',
    parentName: '',
  };
  associateConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields(['phone', 'relevanceType', 'couldReward'], (errors, values) => {
      if (!errors) {
        if (values.couldReward.includes('%')) {
          values.couldReward = values.couldReward.substr(0, values.couldReward.length - 1);
        }
        onOk(values);
        this.setState({
          type: '',
          parentName: '',
        });
        this.props.form.resetFields();
      }
    });
  };
  associateCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      type: '',
      parentName: '',
    });
    this.props.form.resetFields();
  };
  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    const { dispatch, info, form } = this.props;
    if (value) {
      const reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码');
      } else {
        getAgentByPhone(value)
          .then(res => {
            form.setFieldsValue({
              reward: res.data.reward,
              parentName: res.data.realname,
            });
          })
          .catch(error => console.log(error));
        callback();
      }
    }
  };
  // 关联中选择代理身份
  handleSelectType = value => {
    const { dispatch } = this.props;
    if (value === 0) {
      this.setState({
        type: 0,
        assignPercent: '100%',
      });
    } else if (value === 1)
      this.setState(
        {
          type: 1,
          assignPercent: '',
        },
        () => {
          message.info('请输入上级代理联系方式！');
        }
      );
  };
  render() {
    const { assignPercent, percentName, type } = this.state;
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title="关联"
        visible={visible}
        onOk={this.associateConfirm}
        onCancel={this.associateCancel}
        width={550}
        loading={this.props.loading}
      >
        <Form layout="inline">
          <FormItem label="联系人">
            {getFieldDecorator('realname')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="联系方式">
            {getFieldDecorator('mobile')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="代理身份">
            {getFieldDecorator('relevanceType', {
              rules: [
                {
                  required: true,
                  message: '请选择代理身份',
                },
              ],
            })(
              <RadioGroup
                style={{ width: '350px' }}
                onChange={e => this.handleSelectType(e.target.value)}
              >
                <Radio value={0}>总代理</Radio>
                <Radio value={1}>其他代理</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="可分配比例">
            {getFieldDecorator('reward', {
              initialValue: assignPercent,
            })(<Input disabled style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="分润比例">
            {getFieldDecorator('couldReward', {
              rules: [
                {
                  required: true,
                  message: '请输入分润比例',
                },
              ],
            })(<Input style={{ width: '150px' }} suffix="%" />)}
          </FormItem>
          {type === 1 ? (
            <>
              {' '}
              <FormItem label="上级代理联系方式">
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入上级代理联系方式',
                    },
                    {
                      validator: this.mobileValidator,
                    },
                  ],
                })(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="上级代理">
                {getFieldDecorator('parentName')(<Input disabled style={{ width: '150px' }} />)}
              </FormItem>
            </>
          ) : null}
        </Form>
      </Modal>
    );
  }
}

export default AssociateModal;
