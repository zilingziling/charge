import React, { Component } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Form, message, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import InputNumber from 'antd/es/input-number';

@connect(({ SystemConfig, loading }) => ({
  SystemConfig,
  loading: loading.models.SystemConfig,
}))
@Form.create()
class ConfigInfo extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  getSys() {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/getSys',
      callback: function(res) {
        z.setState({ loading: false });
      },
    });
  }

  putSys(agentOfflineWarningTime, backOfflineWarningTime, freeDailyUseTime) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/putSys',
      payload: {
        agentOfflineWarningTime: agentOfflineWarningTime,
        backOfflineWarningTime: backOfflineWarningTime,
        freeDailyUseTime: freeDailyUseTime,
      },
      callback: function(res) {
        z.setState({
          visible: false,
          confirmLoading: false,
        });
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getSys();
      },
    });
  }

  componentDidMount() {
    this.getSys();
  }

  showModal = () => {
    this.props.form.setFieldsValue({
      agentOfflineWarningTime: this.props.SystemConfig.sys.agentOfflineWarningTime,
      backOfflineWarningTime: this.props.SystemConfig.sys.backOfflineWarningTime,
      freeDailyUseTime: this.props.SystemConfig.sys.freeDailyUseTime,
    });
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    this.props.form.validateFields((err, value) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const agentOfflineWarningTime = value['agentOfflineWarningTime'];
      const backOfflineWarningTime = value['backOfflineWarningTime'];
      const freeDailyUseTime = value['freeDailyUseTime'];

      this.putSys(agentOfflineWarningTime, backOfflineWarningTime, freeDailyUseTime);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.contentWrapper}>
        <Card>
          <p>商户每日免费使用时长：{this.props.SystemConfig.sys.freeDailyUseTime} 小时</p>
          <p>后台设备离线预警时间：{this.props.SystemConfig.sys.backOfflineWarningTime} 小时</p>
          <p>代理设备离线预警时间：{this.props.SystemConfig.sys.agentOfflineWarningTime} 小时</p>
          <Button onClick={() => this.showModal()}>编辑</Button>
        </Card>
        <Modal
          title="采购审核"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form>
            <Form.Item label="商户每日免费使用时长(小时)">
              {getFieldDecorator('freeDailyUseTime', {})(<InputNumber min={0} />)}
            </Form.Item>
            <Form.Item label="后台设备离线预警时间(小时)">
              {getFieldDecorator('backOfflineWarningTime', {})(<InputNumber min={0} />)}
            </Form.Item>
            <Form.Item label="代理设备离线预警时间(小时)">
              {getFieldDecorator('agentOfflineWarningTime', {})(<InputNumber min={0} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ConfigInfo;
