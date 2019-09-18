import React, { Component } from 'react';
import { Table, Row, Col, Input, DatePicker, Button, Form } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from './global.css';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const { RangePicker } = DatePicker;

@connect(({ SystemConfig, loading }) => ({
  SystemConfig,
  loading: loading.models.SystemConfig,
}))
@Form.create()
class Logs extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    interfaceName: '',
    staTime: '',
    endTime: '',
    loginName: '',
    loading: false,
  };

  getLogs(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'SystemConfig/logs',
      payload: {
        condition: {
          type: 1,
          interfaceName: this.state.interfaceName,
          staTime: this.state.staTime,
          endTime: this.state.endTime,
          loginName: this.state.loginName,
        },
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

  componentDidMount() {
    this.getLogs(1);
  }

  handleSubmit = e => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const rangeValue = fieldsValue['range-picker'];
      const interfaceName = fieldsValue['interfaceName'];
      const loginName = fieldsValue['loginName'];
      this.setState(
        {
          interfaceName: interfaceName,
          loginName: loginName,
          staTime: rangeValue ? (rangeValue[0] ? rangeValue[0].format('YYYY-MM-DD') : '') : '',
          endTime: rangeValue ? (rangeValue[1] ? rangeValue[1].format('YYYY-MM-DD') : '') : '',
        },
        () => {
          this.getLogs(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        interfaceName: '',
        loginName: '',
        staTime: '',
        endTime: '',
      },
      () => {
        this.getLogs(1);
      }
    );
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.SystemConfig.logs ? this.props.SystemConfig.logs.list : [];

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '操作',
        dataIndex: 'interfaceName',
        key: 'interfaceName',
      },
      {
        title: '操作时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '参数',
        dataIndex: 'paramsJson',
        key: 'paramsJson',
      },
      {
        title: '请求类型',
        dataIndex: 'requestType',
        key: 'requestType',
      },
    ];

    function onChange(date, dateString) {}

    function pageChange(page) {
      z.getLogs(page);
    }

    return (
      <div>
        <Row className={styles.bgc}>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form} label="操作名称">
                {getFieldDecorator('interfaceName', {})(
                  <Input placeholder="请输入操作名称进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="操作人">
                {getFieldDecorator('loginName', {})(
                  <Input placeholder="请输入操作人进行搜索" className={styles.input} />
                )}
              </Form.Item>
              <Form.Item className={styles.form} label="创建时间">
                {getFieldDecorator('range-picker', {})(<RangePicker onChange={onChange} />)}
              </Form.Item>
            </Form>
            <Button type="primary" icon="search" className={styles.btn} onClick={this.handleSubmit}>
              搜索
            </Button>
            <Button
              icon="reload"
              type="primary"
              onClick={this.handleClearSearch}
              className={styles.btn}
            >
              重置
            </Button>
          </Col>
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
            scroll={{ x: 1000 }}
            dataSource={dataSource}
            columns={columns}
          />
        </Row>
      </div>
    );
  }
}

export default Logs;
