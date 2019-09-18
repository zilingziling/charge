import React, { Component } from 'react';
import {
  Table,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Form,
  Radio,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import { yuan } from 'ant-design-pro/lib/Charts';
import InputNumber from 'antd/es/input-number';
import selfStyle from '@/pages/AlreadyOut/index.less';

@connect(({ SystemConfig, loading }) => ({
  SystemConfig,
  loading: loading.models.SystemConfig,
}))
@Form.create()
class DevicePrice extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    visible: false,
    confirmLoading: false,
  };

  getLogs(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/getPrice',
      payload: {
        condition: {},
        desc: true,
        nowPage: page,
        orderCondition: ['createTime'],
        pageSize: 10,
      },
      callback: function(res) {
        z.setState({ loading: false });
        if (res.data) {
          z.setState({
            current: res.data.pageIndex,
            pageSize: res.data.pageSize,
            total: res.data.total,
          });
        }
      },
    });
  }

  add(price) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/addPrice',
      payload: { price: price },
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
        z.getLogs(1);
      },
    });
  }

  deletePrice(record) {
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/deletePrice',
      payload: { id: record.id },
      callback: function(res) {
        if (res.code === '000000') {
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
        z.getLogs(1);
      },
    });
  }

  componentDidMount() {
    this.getLogs(1);
  }

  showModal = () => {
    this.props.form.setFieldsValue({
      price: '',
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
      const price = value['price'];
      this.add(price * 100);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.SystemConfig.price ? this.props.SystemConfig.price.list : [];

    const columns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <Popconfirm
            title={`是否删除单价为${record.price / 100}的单价设置？`}
            onConfirm={() => this.deletePrice(record)}
          >
            <a href="javascript:;" className={styles.red}>
              {' '}
              删除
            </a>
          </Popconfirm>
        ),
      },
      {
        title: '单价（元/小时）',
        dataIndex: 'price',
        key: 'price',
        render: key => <span>{key ? key / 100 : ''}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
      },
    ];

    function pageChange(page) {
      z.getLogs(page);
    }

    return (
      <div>
        <Row className={styles.bgc}>
          <Button
            type="primary"
            className={styles.btn}
            style={{ marginBottom: '20px' }}
            onClick={() => this.showModal()}
          >
            添加
          </Button>
          <Table
            className={styles.table}
            pagination={{
              defaultCurrent: 1,
              current: this.state.current,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: pageChange,
              showTotal: () => {
                return (
                  <div className={selfStyle.total}>
                    <p>共计：{this.state.total} 条</p>
                  </div>
                );
              },
            }}
            loading={this.state.loading}
            rowKey="id"
            bordered
            dataSource={dataSource}
            columns={columns}
          />
          <Modal
            title="采购审核"
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            <Form>
              <Form.Item label="单价">
                {getFieldDecorator('price', {})(<InputNumber min={0} />)}
              </Form.Item>
            </Form>
          </Modal>
        </Row>
      </div>
    );
  }
}

export default DevicePrice;
