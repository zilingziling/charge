import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Popconfirm, message, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';
import { typeFormatter } from '@/utils/handleNumber';

const FormItem = Form.Item;

@connect(({ record, loading }) => ({
  record,
  loading: loading.models.record,
}))
@Form.create()
class Replace extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    deviceId: '',
    startTime: '',
    endTime: '',
  };

  getRecord(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'record/replace',
      payload: {
        condition: {
          deviceId: this.state.deviceId,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
        },
        desc: true,
        nowPage: page,
        orderCondition: [],
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
    this.getRecord(1);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // deviceId sellerTel oneTel
      // Should format date value before submit.
      const deviceId = fieldsValue['deviceId'];
      const startTime = fieldsValue['startTime'];
      const endTime = fieldsValue['endTime'];
      this.setState(
        {
          deviceId: deviceId,
          startTime: startTime,
          endTime: endTime,
        },
        () => {
          this.getRecord(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        deviceId: '',
        startTime: '',
        endTime: '',
      },
      () => {
        this.getRecord(1);
      }
    );
  };

  render() {
    let z = this;

    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.record.replace ? this.props.record.replace.list : [];
    const columns = [
      {
        title: '原设备编号',
        dataIndex: 'oldDeviceId',
        key: 'oldDeviceId',
      },
      {
        title: '新设备编号',
        dataIndex: 'newDeviceId',
        key: 'newDeviceId',
      },
      {
        title: '详细地址',
        dataIndex: 'boxAddress',
        key: 'boxAddress',
      },
      {
        title: '设备单价',
        dataIndex: 'details',
        key: 'details',
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        key: 'deviceType',
        render: text => typeFormatter(text),
      },
      {
        title: '商户名称',
        dataIndex: 'sellerName',
        key: 'sellerName',
      },
      {
        title: '商户联系人',
        dataIndex: 'sellerContactMan',
        key: 'sellerContactMan',
      },
      {
        title: '联系方式',
        dataIndex: 'sellerContact ',
        key: 'sellerContact ',
      },
      {
        title: '批次',
        dataIndex: 'batchName',
        key: 'batchName',
      },
      {
        title: '替换原因',
        dataIndex: 'reason',
        key: 'reason',
        width: 400,
      },
      {
        title: '替换时间',
        dataIndex: 'recordTime',
        key: 'recordTime',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'opreator',
        key: 'opreator',
      },
    ];

    function pageChange(page) {
      z.getRecord(page);
    }

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="设备编号">
                {getFieldDecorator('deviceId')(<Input style={{ width: '150px' }} />)}
              </FormItem>
              <FormItem label="替换时间">{getFieldDecorator('startTime')(<DatePicker />)}</FormItem>
              <FormItem>
                <Input
                  style={{
                    width: 30,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                  }}
                  placeholder="~"
                  disabled
                />
              </FormItem>
              <FormItem>{getFieldDecorator('endTime')(<DatePicker />)}</FormItem>
              <Button icon="search" type="primary" onClick={this.handleSearch}>
                搜索
              </Button>
              <Button icon="reload" type="primary" onClick={this.handleClearSearch}>
                重置
              </Button>
            </Form>
          </Card>
        </div>
        <Table
          bordered
          rowKey="id"
          scroll={{ x: 2000 }}
          loading={this.state.loading}
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
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default Replace;
