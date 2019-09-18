import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Select, Form, Input, DatePicker, Radio } from 'antd';
import { mobileValidator } from '@/utils/handleNumber';
import { w300 } from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;
const mr20 = {
  marginRight: 20,
};
const w150 = {
  width: 150,
};

const ReturnApplyTab = ({ form }) => {
  const { getFieldDecorator } = form;
  const [way, setWay] = useState(-1);
  const onSelectWay = e => {
    setWay(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="退货仓库">
            {getFieldDecorator('area')(
              <Radio.Group placeholder="请选择补货仓库" style={w150}>
                <Radio value={0}>成都总库</Radio>
                <Radio value={1}>重庆分库</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="收货仓库">
            {getFieldDecorator('name')(
              <Radio.Group placeholder="请选择发货仓库" style={w150}>
                <Radio value={0}>成都总库</Radio>
                <Radio value={1}>重庆分库</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="退货原因">
            {getFieldDecorator('name', {
              rules: [
                {
                  max: 150,
                  message: '长度不超过150字',
                },
              ],
            })(<Input.TextArea style={w300} />)}
          </FormItem>
          <FormItem label="出库方式">
            {getFieldDecorator('y')(
              <Radio.Group placeholder="请选择出库方式" style={w300} onChange={onSelectWay}>
                <Radio value={1}>导入Excel</Radio>
                <Radio value={2}>扫码出库</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {way === 1 ? (
            <FormItem label="出库文件">
              {getFieldDecorator('i')(<Input style={w300} placeholder="请输入仓库名称" />)}
            </FormItem>
          ) : null}
          {way === 2 && (
            <FormItem label="设备">{getFieldDecorator('s')(<Input style={w300} />)}</FormItem>
          )}
          <FormItem label="已录入数量">
            <ul>
              <li>6口设备：12台</li>
              <li>12口设备：12台</li>
              <li>充电线：12个</li>
              <li>充电宝：10个</li>
              <li>机柜：12台</li>
              <li>广告屏（3128）：12台</li>
            </ul>
          </FormItem>
          <FormItem>
            <Button type="primary" style={mr20}>
              确认
            </Button>
            <Button type="primary">返回</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};
export default Form.create()(ReturnApplyTab);
