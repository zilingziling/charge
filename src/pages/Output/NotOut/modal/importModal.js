import React, { Component } from 'react';
import { Modal, Button, Select, Input, Form, DatePicker, Radio, Upload, Icon, message } from 'antd';
import { getBatch, importDevice } from '@/services/outPut';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;
const Option = Select.Option;
@Form.create()
class ImportModal extends Component {
  state = {
    deviceType: '',
    storageId: '',
    result: '',
    selectData: [],
    value: undefined,
    fileList: [],
    params: {},
  };
  scrapConfirm = () => {
    const { params, storageId, fileList } = this.state;
    const { onOk, form } = this.props;
    form.validateFields(['deviceType'], (err, values) => {
      if (!fileList.length) {
        message.error('请上传设备！');
        return;
      }
      if (!err) {
        let reqData = new FormData();
        reqData.append('file', params.get('file'));
        reqData.append('deviceType', values.deviceType);
        reqData.append('storageId', storageId);
        importDevice(reqData).then(res => {
          if (res.code === '000000') {
            message.success('操作成功');
            onOk();
            this.setState({
              deviceType: '',
              selectData: [],
              storageId: '',
              params: {},
              fileList: [],
            });
            this.props.form.resetFields();
          } else {
            message.error(res.msg);
            this.setState({
              selectData: [],
              params: {},
              fileList: [],
            });
          }
        });
      }
    });
  };
  scrapCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      deviceType: '',
      selectData: [],
      storageId: '',
      params: {},
      fileList: [],
    });
    this.props.form.resetFields();
  };
  // 输入类型
  handleInputType = value => {
    this.setState({
      deviceType: value,
    });
  };
  handleSearch = value => {
    const params = {
      condition: {
        name: value,
        exists: 'haha',
      },
      desc: true,
      nowPage: 1,
      orderCondition: ['id'],
      pageSize: 10000,
    };
    getBatch(params).then(res =>
      this.setState({
        selectData: res.data.list,
      })
    );
  };

  handleChange = value => {
    this.setState({
      storageId: value,
    });
  };
  handleUploadChange = info => {
    let fileList = [...info.fileList];
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);
    let req = new FormData();
    req.append('file', fileList[0].originFileObj);
    this.setState({
      params: req,
      fileList,
    });
  };
  render() {
    const { visible } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { deviceType, storageId } = this.state;
    const props = {
      name: 'file',
      action: '/api/test',
      headers: {
        token: localStorage.getItem('token'),
      },
      onChange: this.handleUploadChange,
      // multiple: true,
    };
    const isClickable = !(deviceType && storageId);
    const options = this.state.selectData.map(d => <Option key={d.id}>{d.name}</Option>);
    return (
      <Modal
        title="导入设备"
        visible={visible}
        onOk={this.scrapConfirm}
        onCancel={this.scrapCancel}
        width={550}
      >
        <Form layout="inline">
          <FormItem label="设备类型">
            {getFieldDecorator('deviceType')(
              <RadioGroup onChange={e => this.handleInputType(e.target.value)}>
                <Radio value={6}>6口5台</Radio>
                <Radio value={12}>12口11台</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="批次">
            <Select
              showSearch
              placeholder="请输入批次名称"
              style={{ width: 200 }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch}
              onChange={this.handleChange}
              notFoundContent={null}
              loading={this.props.loading}
              allowClear
              value={this.state.storageId}
            >
              {options}
            </Select>
          </FormItem>
          <FormItem label="设备文件">
            <Upload {...props} fileList={this.state.fileList}>
              <Button disabled={isClickable}>
                <Icon type="upload" /> 点击上传
              </Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default ImportModal;
