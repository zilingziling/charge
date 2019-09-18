import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Select, Form, Input, DatePicker, Radio, Row, Col, message } from 'antd';
import { mobileValidator, onlyNumber } from '@/utils/handleNumber';
import { addW, mr0, searchBtn } from '@/utils/cssStyle';
import searchForm from '@/pages/searchForm.less';
import { request } from '@/utils/request';
import { addReplenish } from '@/services/applyByMe';
const FormItem = Form.Item;

const ReplenishTab = ({ form, init, setA,dispatch }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const [DW, setDW] = useState([]);
  const [RW, setRW] = useState([]);
  const [storageId, setId] = useState(-1);
  useEffect(() => {
    request('/api/storageInfo/myStorage').then(r => {
      if (r.code === '000000') setRW(r.data);
    });
  }, []);
  useEffect(() => {
    request(`/api/storageInfo/storeAuth`, {
      params: {
        storageId,
        type: 1,
      },
    }).then(r => {
      if (r.code === '000000') setDW(r.data);
    });
  }, [storageId]);
  const clear=()=>{
    setA("1")
    resetFields()
  }
  const handleReplenish = () => {
    validateFields((e, v) => {
      if (!e) {
        addReplenish({ ...v }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            init();
            clear()
            dispatch({
              type: 'approve/getReplenish',
              p: {  per_page:10, page:1, order: 'DESC', sortby: 'createTime', type: 2 },
            });
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
const  handleCancel=()=>{
  clear()
}
  return (
    <div className={styles.wrapper} style={addW}>
      <h1 className={styles.addTitle}>- 仓库补货 -</h1>
      <Row gutter={24}>
        <Form className={searchForm.searchForm}>
          <Col span={24}>
            <FormItem label="补货仓库">
              {getFieldDecorator('toStorageId')(
                <Radio.Group placeholder="请选择补货仓库" onChange={e => setId(e.target.value)}>
                  {RW.map(i => (
                    <Radio key={i.storageId} value={i.storageId}>
                      {i.storageName}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="发货仓库">
              {
                DW.length>0?getFieldDecorator('fromStorageId')(
                <Radio.Group placeholder="请选择发货仓库">
                {DW.map(i => (
                  <Radio key={i.storageId} value={i.storageId}>
                    {i.storageName}
                  </Radio>
                ))}
                </Radio.Group>
                ) :"暂无可发货的仓库"
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="6口设备">
              {getFieldDecorator('deviceCountSix', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="12口设备">
              {getFieldDecorator('deviceCountTwelve', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="充电线">
              {getFieldDecorator('chargingLineCount', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="充电宝">
              {getFieldDecorator('terminalCount', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="个" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="机柜A型">
              {getFieldDecorator('cabinetCountA', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="机柜B-1型">
              {getFieldDecorator('cabinetCountB1', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="机柜B-2型">
              {getFieldDecorator('cabinetCountB2', {
                initialValue:"0",
                rules: [{ message: '长度不能超过5', max: 5 }, { validator: onlyNumber }],
              })(<Input addonAfter="台" />)}
            </FormItem>
          </Col>
        </Form>
      </Row>
      <Row>
        <Col span={24} style={searchBtn}>
          <Button type="primary" onClick={handleReplenish}>保存</Button>
          <Button style={mr0} onClick={handleCancel}>返回</Button>
        </Col>
      </Row>
    </div>
  );
};
export default Form.create()(ReplenishTab);
