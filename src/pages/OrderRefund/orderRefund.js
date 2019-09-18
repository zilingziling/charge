import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Divider, Tabs, Form, Icon, Modal } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
class OrderRefund extends Component {
  state = {
    details: {},
    loading: false,
    ModalText: '您是否要执行退款操作？',
    visible: false,
    confirmLoading: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: '退款操作中...',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
        ModalText: '您是否要执行退款操作？',
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.bgc}>
        <Modal
          title="强制结束"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{this.state.ModalText}</p>
        </Modal>
        <Form className={styles.searchBox}>
          <Row className={styles.searchLine}>
            <Form.Item className={styles.form} label="输入订单号编号">
              {getFieldDecorator('orderId', {})(
                <Input placeholder="请输入订单号进行搜索" className={styles.input} />
              )}
            </Form.Item>
            <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
              查询
            </Button>
            <Button type="primary" icon="logout" className={styles.btn} onClick={this.showModal}>
              退款
            </Button>
            <Button type="primary" icon="logout" className={styles.btn} >
              强制结束
            </Button>
            <Button type="primary" icon="logout" className={styles.btn} >
              信用撤销
            </Button>
          </Row>
        </Form>
        <Row className={styles.title}>订单信息</Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>订单号 : {this.state.details.id}</Col>
          <Col className={styles.right}>支付订单号 : {this.state.details.userId}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>订单渠道 : {this.state.details.sellerName}</Col>
          <Col className={styles.right}>押金方式 : {this.state.details.returnSellerName}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>订单状态 : {this.state.details.sellerName}</Col>
          <Col className={styles.right}>订单单价 : {this.state.details.returnSellerName}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>租借时长 : {this.state.details.rentAddress}</Col>
          <Col className={styles.right}>订单金额 : {this.state.details.returnAddress}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>订单创建时间 : {this.state.details.deviceId}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>订单支付时间 : {this.state.details.continueTime}</Col>
          <Col className={styles.right}>是否退款 : {this.state.details.rentTime}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>客户ID : {this.state.details.continueTime}</Col>
          <Col className={styles.right}>绑定手机号 : {this.state.details.rentTime}</Col>
        </Row>
        <Divider style={{ marginBottom: 32 }} />

        <Row className={styles.title}>出借信息</Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>商户名称 : {this.state.details.id}</Col>
          <Col className={styles.right}>商户编号 : {this.state.details.userId}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>门店名称 : {this.state.details.sellerName}</Col>
          <Col className={styles.right}>门店编号 : {this.state.details.returnSellerName}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>门店所在地区 : {this.state.details.sellerName}</Col>
          <Col className={styles.right}>详细地址 : {this.state.details.returnSellerName}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>出借设备编号 : {this.state.details.sellerName}</Col>
          <Col className={styles.right}>小宝编号 : {this.state.details.returnSellerName}</Col>
        </Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>出借仓位编号 : {this.state.details.sellerName}</Col>
        </Row>
        <Divider style={{ marginBottom: 32 }} />
        <Row className={styles.title}>BD/代理信息</Row>
        <Row justify="start" type="flex" className={styles.line}>
          <Col className={styles.left}>BD名称 : {this.state.details.id}</Col>
          <Col className={styles.right}>联系方式 : {this.state.details.userId}</Col>
        </Row>
      </div>
    );
  }
}

export default OrderRefund;
