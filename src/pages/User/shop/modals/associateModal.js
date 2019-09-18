import React, { Component } from 'react';
import { Modal, Radio, Select, Input, Form, message, Table } from 'antd';
import { connect } from 'dva';
const FormItem = Form.Item;
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create({
  mapPropsToFields(props) {
    if (props.info) {
      return {
        name: Form.createFormField({
          value: props.info.name,
        }),
        linkman: Form.createFormField({
          value: props.info.linkman,
        }),
        linktel: Form.createFormField({
          value: props.info.linktel,
        }),
      };
    }
  },
})
class AssociateModal extends Component {
  associateConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields(['parentAgentPhone'], (errors, values) => {
      if (!errors) {
        let agentPhone = values.parentAgentPhone;
        delete values.parentAgentPhone;
        onOk({ ...values, agentPhone });
        this.props.form.resetFields();
      }
    });
  };
  associateCancel = () => {
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
      callback();
    }
  };
  render() {
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
          <FormItem label="商户名称">
            {getFieldDecorator('name')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="联系人">
            {getFieldDecorator('linkman')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="联系方式">
            {getFieldDecorator('linktel')(<Input style={{ width: '150px' }} disabled />)}
          </FormItem>
          <FormItem label="上级代理联系方式">
            {getFieldDecorator('parentAgentPhone', {
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
        </Form>
      </Modal>
    );
  }
}

export default AssociateModal;
