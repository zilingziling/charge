import React, { Component } from 'react';
import { Typography, Input, Button, Form, notification, Icon, Checkbox } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './login.less';
import { connect } from 'dva';
import router from 'umi/router';
import logo from '@/assets/images/logo.png';
import shadow from '@/assets/images/shadow.png';
const { Title } = Typography;
@connect(({ login, loading }) => ({
  login,
  loading: loading.models.login,
}))
@Form.create()
class Login extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        // Should format date value before submit.
        const user = fieldsValue['user'];
        const password = fieldsValue['password'];
        this.login(user, password);
      });
    }
  };

  login(name, password) {
    const { dispatch } = this.props;
    dispatch({
      type: 'Login/login',
      payload: {
        name: name,
        password: password,
      },
      callback: function(res) {
        if (res.code === '000000' && res.data.token) {
          localStorage.setItem('token', res.data.token);
          notification['success']({
            message: '登录成功！',
          });
          localStorage.setItem('authority', JSON.stringify(res.data.path));
          localStorage.setItem('userName', JSON.stringify(res.data.realname));
          setTimeout(function() {
            router.push('/');
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
      const user = fieldsValue['user'];
      const password = fieldsValue['password'];
      this.login(user, password);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginSec}>
          {/*<img src={shadow} alt="shadow" />*/}
          <ul>
            <li className={styles.left}>
              <img src={logo} alt="logo" />
              <h1>
                MANAGEMENT <br /> SYSTEM
              </h1>
              <p>京猪充电-让您永不断电</p>
              <h6>成都小麦花网络技术有限公司</h6>
            </li>
            <li className={styles.right}>
              <h1>
                <p>京猪充电</p>
                <p>
                  <span>后台管理系统</span>
                </p>
              </h1>
              <h2>
                <span>Log in</span>
                Jingzhu Charging Management system
              </h2>
              <Form className={styles.form}>
                <Form.Item>
                  <span>账号/Account number：</span>
                  {getFieldDecorator('user', {})(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      size="large"
                      placeholder="用户名"
                      // allowClear
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <span>密码/Password：</span>
                  {getFieldDecorator('password', {})(
                    <Input
                      size="large"
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="密码"
                      type="password"
                      // allowClear
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Checkbox checked>记住我/Remember Me</Checkbox>
                </Form.Item>
                <Button type="primary" size="large" onClick={this.handleSubmit}>
                  LOG IN
                </Button>
              </Form>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Login;
