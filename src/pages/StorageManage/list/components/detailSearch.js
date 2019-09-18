import React from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Cascader, Form, Input, Select, TimePicker } from 'antd';
import {mr20} from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;
const w150 = {
  width: 150,
};

const DetailSearch = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="设备编号">
            {getFieldDecorator('name')(<Input placeholder="请输入设备编号" style={w150} />)}
          </FormItem>
          <FormItem label="设备类型">
            {getFieldDecorator('area')(
              <Select placeholder="请选择设备类型" style={w150}>
                <Option value={0}>充电宝</Option>
                <Option value={1}>充电线</Option>
                <Option value={2}>6口设备</Option>
                <Option value={3}>12设备</Option>
                <Option value={4}>机柜</Option>
                <Option value={5}>广告屏（3128）</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="设备状态">
            {getFieldDecorator('ff')(
              <Select placeholder="请选择设备状态" style={w150}>
                <Option value={0}>良品</Option>
                <Option value={1}>不良品</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="入库时间">
            {getFieldDecorator('startTime', {
              rules: [
                {
                  required: true,
                  message: '请选择开始时间',
                },
              ],
            })(<TimePicker />)}
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
            {getFieldDecorator('endTime', {
              rules: [
                {
                  required: true,
                  message: '请选择结束时间',
                },
              ],
            })(<TimePicker />)}
          </FormItem>
          <FormItem>
            <Button icon="search" type="primary" style={mr20}>
              搜索
            </Button>
            <Button icon="reload" type="primary">
              重置
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};
export default Form.create()(DetailSearch);
