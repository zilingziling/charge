import React, { useEffect, useState } from 'react';
import {  Row, Radio, Form, Input, Select, Col, Cascader, message, Modal } from 'antd';
import styles from '@/pages/mylayout.less';
import searchForm from '@/pages/searchForm.less';
import { audit } from '@/services/applyByMe';
const FormItem = Form.Item;

const Audit = ({ form,auditV,setAuditV,selectId,init,dispatch}) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const handleAudit = () => {
    validateFields((e, v) => {
      if (!e) {
        audit({ ...v,type:1,sceneId:selectId }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            init();
            setAuditV(false)
            resetFields()
            dispatch({
              type: 'apply/getReplenish',
              p: {  per_page:10, page:1, order: 'DESC', sortby: 'createTime', type: 1 },
            });
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
  const handleCancel=()=>{
    setAuditV(false)
    resetFields()
  }
  return (
    <Modal title="审核" visible={auditV}  onOk={handleAudit} onCancel={handleCancel}>
      <div className={styles.wrapper} >
        <Row gutter={24}>
          <Form className={searchForm.searchForm}>
            <Col span={24}>
              <FormItem label="是否通过">
                {getFieldDecorator('auditStatus', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否通过',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value={2}>通过</Radio>
                    <Radio value={3}>不通过</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="备注">
                {getFieldDecorator('auditRemarks', {
                  rules: [
                    {
                      required: true,
                      message: '请输入备注',
                    },
                    { message: '长度不能超过20', max: 20 },
                  ],
                })(<Input.TextArea  placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Form>
        </Row>
      </div>
    </Modal>
  );
};

export default Form.create()(Audit);
