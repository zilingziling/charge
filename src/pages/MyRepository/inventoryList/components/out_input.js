import React, { useState } from 'react';
import { Button, Card, Form, Input, Select, TimePicker, Radio } from 'antd';
import { w150, w300 } from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;

const OutInput = ({ form }) => {
  const { getFieldDecorator } = form;
  const [way, setWay] = useState(-1);
  const onSelectWay = e => {
    setWay(e.target.value);
  };
  return (
    <Card>
      <Form>
        <FormItem label="出库仓库">
          {getFieldDecorator('hah')(
            <Radio.Group style={w300}>
              <Radio value={1}>成都总库</Radio>
              <Radio value={2}>重庆分库</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="设备类型">
          {getFieldDecorator('area')(
            <Radio.Group placeholder="请选择设备类型" style={w300}>
              <Radio value={0}>充电宝</Radio>
              <Radio value={1}>充电线</Radio>
              <Radio value={2}>6口设备</Radio>
              <Radio value={3}>12设备</Radio>
              <Radio value={4}>机柜</Radio>
              <Radio value={5}>广告屏（3128）</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="设备供应商">
          {getFieldDecorator('hh')(
            <Radio.Group placeholder="请选择设备供应商" style={w300}>
              <Radio value={0}>供应商A</Radio>
              <Radio value={1}>供应商B</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem label="入库方式">
          {getFieldDecorator('y')(
            <Radio.Group placeholder="请选择入库方式" style={w300} onChange={onSelectWay}>
              <Radio value={1}>导入Excel</Radio>
              <Radio value={2}>扫码入库</Radio>
            </Radio.Group>
          )}
        </FormItem>
        {way === 1 ? (
          <FormItem label="入库文件">
            {getFieldDecorator('i')(<Input style={w300} placeholder="请输入仓库名称" />)}
          </FormItem>
        ) : null}
        {way === 2 && (
          <FormItem label="设备">{getFieldDecorator('s')(<Input style={w300} />)}</FormItem>
        )}
        <FormItem label="已录入数量">
          {getFieldDecorator('k')(<Input disabled style={w300} />)}
        </FormItem>
        <Button icon="search" type="primary">
          确认
        </Button>
        <Button icon="reload" type="primary">
          返回
        </Button>
      </Form>
    </Card>
  );
};
export default Form.create()(OutInput);
