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
              <FormItem label="状态">
                {getFieldDecorator('state')(
                  <Select placeholder="请选择状态">
                    <Option value={0}>待初审</Option>
                    <Option value={1}>待复审</Option>
                    <Option value={2}>待发货</Option>
                    <Option value={3}>待收货</Option>
                    <Option value={4}>收货待审核</Option>
                    <Option value={5}>已完成</Option>
                    <Option value={-1}>已拒绝</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="补货仓库">
                {getFieldDecorator('replenishStorageName')(<Input placeholder="请输入补货仓库" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="发货仓库">
                {getFieldDecorator('sendStorageName')(<Input placeholder="请输入发货仓库" />)}
              </FormItem>
            </Col>
            {v && (
              <Col span={8} className={searchForm.time}>
                <FormItem label="申请时间">
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
