import React, { useEffect, useState } from 'react';
import { Button, Row, Radio, Form, Input, Select, Col, Cascader, message, Modal } from 'antd';
import styles from '@/pages/mylayout.less';
import { formatTreeData, mobileValidator } from '@/utils/handleNumber';
import { getGender } from '@/services/systemManage/employee';
import { addW, mr0, searchBtn } from '@/utils/cssStyle';
import searchForm from '@/pages/searchForm.less';
import { addAgent, addShop } from '@/services/userManage/userManage';
const FormItem = Form.Item;

const Add = ({ form,addV,setV}) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleAdd = () => {
    validateFields((e, v) => {
      if (!e) {
        addShop({ ...v }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            init();
            setV(false)
            resetFields()
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
const handleCancel=()=>{
  setV(false)
  resetFields()
}
  return (
    <Modal title="新增商户" visible={addV}  onOk={handleAdd} onCancel={handleCancel}>
      <div className={styles.wrapper} >
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={24}>
              <FormItem label="商户名称">
                {getFieldDecorator('businessName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商户名称',
                    },
                  ],
                })(<Input allowClear placeholder="请输入商户名称" />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="联系方式">
                {getFieldDecorator('businessPhone', {
                  rules: [
                    {
                      required: true,
                      message: '请输入商户联系方式',
                    },
                    {
                      validator: mobileValidator,
                    },
                  ],
                })(<Input allowClear placeholder="请输入商户联系方式" />)}
              </FormItem>
            </Col>
          </Form>
        </Row>
      </div>
    </Modal>
  );
};

export default Form.create()(Add);
