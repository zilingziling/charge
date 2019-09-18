import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Select, Form, Input, DatePicker, Row, Col, Icon } from 'antd';
import { formatterTime, mobileValidator } from '@/utils/handleNumber';
import searchForm from '@/pages/searchForm.less';
import { more, resetStyle, searchBtn } from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;
const mr20 = {
  marginRight: 20,
};

const Search = ({ form, setP, setSearch }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const [v, setV] = useState(false);
  const handleSearch = () => {
    validateFields((err, v) => {
      if (!err) {
        if (v.startTime) {
          v.startTime = formatterTime(v.startTime);
        }
        if (v.endTime) {
          v.endTime = formatterTime(v.endTime);
        }
        setSearch({ ...v });
        setP(1);
      }
    });
  };
  const handleReset = () => {
    setSearch({});
    setP(1);
    resetFields();
  };
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={8}>
              <FormItem label="订单号">
                {getFieldDecorator('orderId')(
                  <Input placeholder="请输入订单号" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="支付渠道">
                {getFieldDecorator('orderType')(
                  <Select placeholder="请选择">
                    <Option value={"1"}>微信</Option>
                    <Option value={"2"}>支付宝</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="订单状态">
                {getFieldDecorator('orderState')(
                  <Select placeholder="请选择">
                    <Option value={"-2"}>订单异常</Option>
                    <Option value={"-1"}>未支付</Option>
                    <Option value={"0"}>已结束</Option>
                    <Option value={"1"}>租借中</Option>
                    <Option value={"2"}>购买订单</Option>
                    <Option value={"3"}>订单废弃</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {v && (
              <>
              <Col span={8} >
                <FormItem label="押金方式">
                  {getFieldDecorator('isDepositfree')(
                    <Select placeholder="请选择">
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
                <Col span={8} >
                  <FormItem label="出借门店">
                    {getFieldDecorator('rentStoreName')(
                      <Input placeholder="请输入出借门店" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem label="是否退款">
                    {getFieldDecorator('returnState')(
                      <Select placeholder="请选择">
                        <Option value={"1"}>未退款</Option>
                        <Option value={"2"}>全部退款</Option>
                        <Option value={"3"}>部分退款</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8} >
                  <FormItem label="设备租借状态">
                    {getFieldDecorator('rentStatus')(
                      <Select placeholder="请选择">
                        <Option value={"1"}>正常</Option>
                        <Option value={"2"}>失败</Option>
                        <Option value={"3"}>异常</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              <Col span={8} className={searchForm.time}>
                <FormItem label="创建时间">
                  {getFieldDecorator('startTime')(<DatePicker />)}
                </FormItem>
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
              </Col>
              </>
            )}
          </Form>
        </Row>
        <Row>
          <Col span={24} style={searchBtn}>
            <Button icon="search" type="primary" style={mr20} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon="reload" style={resetStyle} onClick={handleReset}>
              重置
            </Button>
            <a style={more} href="#" onClick={() => setV(!v)}>
              更多 <Icon type={v ? 'caret-up' : 'caret-down'} />
            </a>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default Form.create()(Search);
