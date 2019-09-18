import React, { Component } from 'react';
import { Form, Input, Card, Tag, message, Button, Tooltip, Radio } from 'antd';
import { getOneAgent } from '@/services/outPut';
import { scanBaby } from '@/services/chargeBabyS';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
@Form.create()
class OutTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: [],
      inputVisible: false,
      inputValue: '',
      tags: [],
      complete: false,
      name: '',
      agentPhone: '',
      errorVisible: false,
      errorText: '',
      result: '',
    };
  }

  // 展示输入框
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value }, () => {
      if (this.state.inputValue.length === 12 && this.state.inputValue.includes('JZCB')) {
        scanBaby(this.state.inputValue).then(res => {
          if (res.code === '000000') {
            this.setState(
              {
                result: 'success',
                errorVisible: false,
              },
              () => this.input.blur()
            );
          } else
            this.setState({
              errorVisible: true,
              errorText: res.msg,
              result: null,
            });
        });
      }
    });
  };

  // 输入框确认
  handleInputConfirm = () => {
    const { inputValue, errorVisible, result } = this.state;
    if (result === 'success') {
      if (inputValue.length === 12) {
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        this.setState({
          tags,
          inputVisible: true,
          inputValue: '',
          complete: true,
        });
        this.input.focus();
      }
    }
  };
  saveInputRef = input => (this.input = input);

  //  出库确认
  outConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    const { tags, agentPhone } = this.state;
    validateFields(['expressNo', 'details', 'exportType'], (errors, values) => {
      if (!errors && tags.length > 0) {
        onOk({ ...values, ids: tags, agentPhone });
        this.setState({
          name: '',
          tags: [],
          agentPhone: '',
          inputValue: '',
        });
        this.props.form.resetFields();
      } else {
        message.error('请添加设备');
      }
    });
  };
  outCancel = () => {
    this.setState({
      name: '',
      tags: [],
      agentPhone: '',
    });
    const { onCancel } = this.props;
    onCancel();
    this.props.form.resetFields();
  };

  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    if (value) {
      const reg = /^1[3|4|5|6|7|8|9|0|2|1][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码');
      } else {
        getOneAgent(value)
          .then(res => {
            this.setState({
              name: res.data.realname,
              agentPhone: value,
            });
          })
          .catch(error => console.log(error));
        callback();
      }
    }
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
  // 删除已输入的设备
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { tags, errorVisible, inputValue, errorText } = this.state;
    return (
      <Card>
        <Form layout="inline">
          <FormItem label="领用人手机号码">
            {getFieldDecorator('agentPhone', {
              rules: [
                {
                  validator: this.mobileValidator,
                },
                {
                  required: true,
                  message: '请输入手机号码',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="领用人">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
            })(<Input style={{ width: '100px' }} disabled />)}
          </FormItem>
          <FormItem label="出库类型" style={{ display: 'block' }}>
            {getFieldDecorator('exportType', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <RadioGroup>
                <Radio value={0}>正常领取</Radio>
                <Radio value={1}>正常补货</Radio>
                <Radio value={2}>购买补货</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="快递单号" style={{ display: 'block', marginLeft: '10px' }}>
            {getFieldDecorator('expressNo')(<Input style={{ width: '200px' }} suffix="选填" />)}
          </FormItem>
          <FormItem
            label="设备"
            style={{
              display: 'block',
              marginTop: '20px',
              marginBottom: '20px',
              marginLeft: '10px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {tags.map((tag, index) => {
                return (
                  <Tag
                    style={{
                      width: 150,
                      height: 32,
                      marginRight: '10px',
                      marginTop: '5px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontSize: '16px',
                      paddingTop: '5px',
                    }}
                    key={tag}
                    closable
                    onClose={e => {
                      e.preventDefault();
                      this.handleClose(tag);
                    }}
                  >
                    {tag}
                  </Tag>
                );
              })}
              <Tooltip placement="top" title="请输入正确的设备编号，重复编号无法键入">
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  style={{ width: 150, marginTop: '5px' }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  placeholder="添加设备"
                  allowClear
                />
                {errorVisible && inputValue ? (
                  <p style={{ color: 'red', textAlign: 'center' }}>{errorText}</p>
                ) : null}
              </Tooltip>
            </div>
          </FormItem>
          <FormItem label="备注" style={{ marginBottom: '20px' }}>
            {getFieldDecorator('details', {
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
        <div>
          <Button type="primary" onClick={this.outConfirm}>
            确定
          </Button>
          <Button onClick={this.outCancel} style={{ marginLeft: '10px' }}>
            返回
          </Button>
        </div>
      </Card>
    );
  }
}

export default OutTab;
