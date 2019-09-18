import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, InputNumber } from 'antd';
import { getPrice } from '@/services/alreadyOut';
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const ml = {
  marginLeft: '38px',
};
const address = {
  width: '300px',
  resize: 'none',
};
@Form.create({
  mapPropsToFields(props) {
    if (props.editData) {
      return {
        address: Form.createFormField({
          value: props.editData.boxAddress,
        }),
      };
    }
  },
})
class EditModal extends Component {
  state = {
    priceArr: [],
  };
  componentDidMount() {
    getPrice({
      condition: {},
      desc: true,
      nowPage: 1,
      orderCondition: '',
      pageSize: 1000,
    }).then(res => {
      if (res.code === '000000' && res.data)
        this.setState({
          priceArr: res.data.list,
        });
    });
  }
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
    const { priceArr } = this.state;
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
          <FormItem label="当前设备单价" style={{ marginLeft: 10 }}>
            {getFieldDecorator('priceId', {
              rules: [
                {
                  required: true,
                  message: '请选择单价',
                },
              ],
            })(
              <Select style={{ width: 150 }}>
                {priceArr &&
                  priceArr.map(item => (
                    <Option key={item.id} value={item.id}>
                      {(item.price / 100).toFixed(2)}元/小时
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="详细地址" style={ml}>
            {getFieldDecorator('address', {
              rules: [
                {
                  required: true,
                  message: '请输入详细地址',
                },
              ],
            })(<TextArea style={address} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default EditModal;
