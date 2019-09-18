import React, { Component } from 'react';
import { Button, Card, Form, Input, Modal, notification } from 'antd';
import styles from '@/pages/login/login.less';
import { connect } from 'dva';
import router from 'umi/router';

@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login,
}))
@Form.create()
class Password extends Component {
  password(confirmPassword, newPassword, oldPassword) {
    const { dispatch, onOk } = this.props;
    dispatch({
      type: 'Login/password',
      payload: {
        confirmPassword,
        newPassword,
        oldPassword,
      },
      callback: function(res) {
        if (res.code === '000000') {
          localStorage.removeItem('token');
          localStorage.removeItem('authority');
          localStorage.removeItem('userName');
          notification['success']({
            message: '修改成功！',
          });
          onOk();
          setTimeout(function() {
            router.push('/login');
          }, 1000);
        } else {
          notification['error']({
            message: res.msg,
          });
        }
      },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const oldPassword = fieldsValue['oldPassword'];
      const newPassword = fieldsValue['newPassword'];
      const confirmPassword = fieldsValue['confirmPassword'];
      this.password(confirmPassword, newPassword, oldPassword);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onCancel } = this.props;
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        title="- 修改密码 -"
        className={styles.passwordWrap}
      >
        <Form>
          <Form.Item label="原密码/Original Password：">
            {getFieldDecorator('oldPassword', {})(
              <Input placeholder="请输入旧密码" type="password" autoComplete="off" />
            )}
          </Form.Item>
          <Form.Item label="新密码/New Password：">
            {getFieldDecorator('newPassword', {})(
              <Input placeholder="请输入新密码" type="password" autoComplete="off" />
            )}
          </Form.Item>
          <Form.Item label="确认密码/Confirm Password：">
            {getFieldDecorator('confirmPassword', {})(
              <Input placeholder="请再次输入新密码" type="password" autoComplete="off" />
            )}
          </Form.Item>
        </Form>
        <Button type="primary" onClick={this.handleSubmit} className={styles.confirm}>
          确认
        </Button>
      </Modal>
    );
  }
}

export default Password;
