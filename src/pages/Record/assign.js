import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Popconfirm, message, DatePicker } from 'antd';
import styles from '@/pages/mylayout.less';
import { connect } from 'dva';
import moment from 'moment';
import selfStyle from '@/pages/AlreadyOut/index.less';

const FormItem = Form.Item;

@connect(({ record, loading }) => ({
  record,
  loading: loading.models.record,
}))
@Form.create()
class Assign extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    deviceId: '',
    sellerContact: '',
  };

  toDecimal(x) {
    let f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  }

  getRecord(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'record/installed',
      payload: {
        condition: {
          deviceId: this.state.deviceId,
          sellerContact: this.state.sellerContact,
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
      const sellerContact = fieldsValue['sellerContact'];
      this.setState(
        {
          deviceId: deviceId,
          sellerContact: sellerContact,
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
        sellerContact: '',
      },
      () => {
        this.getRecord(1);
      }
    );
  };

  render() {
    let z = this;

    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.record.installed ? this.props.record.installed.list : [];
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceId',
        key: 'deviceId',
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
        title: '商户联系方式',
        dataIndex: 'sellerContact',
        key: 'sellerContact',
      },
      {
        title: '部署人',
        dataIndex: 'opreator',
        key: 'opreator',
      },
      {
        title: '部署人联系方式',
        dataIndex: 'opreatorContact',
        key: 'opreatorContact',
      },
      {
        title: '详细地址',
        dataIndex: 'boxAddress',
        key: 'boxAddress',
      },
      {
        title: '经纬度',
        dataIndex: 'longitudeLatitude',
        key: 'longitudeLatitude',
      },
      {
        title: '设备单价',
        dataIndex: 'details',
        key: 'details',
        render: key => <span>{key || key === 0 ? this.toDecimal(key / 100) : ''}</span>,
      },
      {
        title: '部署时间',
        dataIndex: 'recordTime',
        key: 'recordTime ',
        render: key => <span>{key ? moment(key).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
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
              <FormItem label="商户联系方式">
                {getFieldDecorator('sellerContact')(<Input style={{ width: '150px' }} />)}
              </FormItem>
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

export default Assign;
