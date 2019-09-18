import React, { Component, useState } from 'react';
import { Button, Card, Icon, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import styles from '@/pages/mylayout.less';
import { formatterTime, mobileValidator } from '@/utils/handleNumber';
import btnStyle from '@/pages/btnStyle.less';
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
          v.startTime=formatterTime(v.startTime);
        }
        if (v.endTime) {
          v.endTime= formatterTime(v.endTime);
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
      <Card className={styles.searchBar} bordered={false}>
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={8}>
              <FormItem label="用户来源">
                {getFieldDecorator('userSource')(
                  <Select placeholder="请选择">
                    <Option value={1}>微信</Option>
                    <Option value={2}>支付宝</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="绑定手机号">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      validator: mobileValidator,
                    },
                  ],
                })(<Input allowClear placeholder="输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={8} className={searchForm.time}>
              <FormItem label="创建时间">{getFieldDecorator('startTime')(<DatePicker />)}</FormItem>
              <FormItem>
                <Input
                  style={{
                    width: 30,
                    pointerEvents: 'none',
                    backgroundColor: '#fff',
                    border: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
              </FormItem>
              <FormItem>{getFieldDecorator('endTime')(<DatePicker />)}</FormItem>
            </Col>
            <Col span={8}>
              {v && (
                <>
                  <br />
                  <FormItem label="关注情况">
                    {getFieldDecorator('focus')(
                      <Select placeholder="请选择">
                        <Option value={1}>已关注公众号</Option>
                        <Option value={2}>已关注生活号</Option>
                        <Option value={3}>未关注</Option>
                      </Select>
                    )}
                  </FormItem>
                </>
              )}
            </Col>
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

export default Form.create({})(Search);
