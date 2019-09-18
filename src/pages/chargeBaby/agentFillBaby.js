import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Form } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import styles from '@/pages/order/global.css';
import { connect } from 'dva';
import selfStyle from '@/pages/AlreadyOut/index.less';

@connect(({ baby, loading }) => ({
  baby,
  loading: loading.models.baby,
}))
@Form.create()
class AgentFillBaby extends Component {
  state = {
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    agentContact: '',
  };

  getAgentBaby(page) {
    this.setState({ loading: true });
    let z = this;
    const { dispatch } = this.props;
    dispatch({
      type: 'baby/getAgentBaby',
      payload: {
        condition: {
          mobile: this.state.agentContact,
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
    this.getAgentBaby(1);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      // Should format date value before submit.
      const agentContact = fieldsValue['agentContact'];
      this.setState(
        {
          agentContact: agentContact,
        },
        () => {
          this.getAgentBaby(1);
        }
      );
    });
  };

  handleClearSearch = e => {
    e.preventDefault();

    this.props.form.resetFields();
    this.setState(
      {
        agentContact: '',
      },
      () => {
        this.getAgentBaby(1);
      }
    );
  };

  render() {
    const z = this;
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.baby.agentBaby ? this.props.baby.agentBaby.list : [];

    const columns = [
      {
        title: '代理编号',
        dataIndex: 'agentId',
        key: 'agentId',
      },
      {
        title: '总代理名称',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '联系方式',
        dataIndex: 'agentPhone',
        key: 'agentPhone',
      },
      {
        title: '小宝总量',
        dataIndex: 'boxCount',
        key: 'boxCount',
      },
      {
        title: '正常领取数量',
        dataIndex: 'normalNum',
        key: 'normalNum',
      },
      {
        title: '正常补货数量',
        dataIndex: 'normalIncrease',
        key: 'normalIncrease',
      },
      {
        title: '购买补货数量',
        dataIndex: 'normalBuyIncrease',
        key: 'normalBuyIncrease',
      },
      {
        title: '被购买小宝数量',
        dataIndex: 'buyBoxCount',
        key: 'buyBoxCount',
      },
    ];

    function pageChange(page, pageSize) {
      console.log(page, pageSize);
      z.getAgentBaby(page);
    }

    return (
      <div className={styles.bgc}>
        <Row>
          <Col className={styles.col}>
            <Form className={styles.form}>
              <Form.Item className={styles.form} label="总代理联系方式">
                {getFieldDecorator('agentContact', {})(
                  <Input placeholder="请输入总代理联系方式进行搜索" className={styles.input} />
                )}
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
            loading={this.state.loading}
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
            rowKey="agentId"
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

export default AgentFillBaby;
