import React, { Component, useState } from 'react';
import { Button, Card, Row, Form, Input, Select, DatePicker, Col, Icon } from 'antd';
import styles from '@/pages/mylayout.less';
import { formatterTime, mobileValidator } from '@/utils/handleNumber';
import searchForm from '@/pages/searchForm.less';
import { more, resetStyle, searchBtn } from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};
const mr20 = {
  marginRight: 20,
};

const Search = ({ form,setP, setSearch }) => {
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
      <Card className={styles.searchBar}>
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={8}>
              <FormItem label="商户联系方式">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      validator: mobileValidator,
                    },
                  ],
                })(<Input allowClear  placeholder="输入手机号" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="商户名称">
                {getFieldDecorator('businessname')(
                  <Input allowClear  placeholder="输入商户名称" />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="主体名称">
                {getFieldDecorator('subjectname')(
                  <Input allowClear  placeholder="输入主体名称" />
                )}
              </FormItem>
            </Col>
            {
              v && <Col span={8} className={searchForm.time}>
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
                <FormItem>
                  {getFieldDecorator('endTime')(<DatePicker />)}
                </FormItem>
              </Col>
            }
          </Form>
        </Row>
        <Row>
          <Col span={24} style={searchBtn}>
            <Button icon="search" type="primary"  onClick={handleSearch}>
              搜索
            </Button>
            <Button icon="reload"  style={resetStyle} onClick={handleReset}>
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
