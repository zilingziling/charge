import React, { useEffect, useState } from 'react';
import { Button, Row, Radio, Form, Input, Select, Col, Cascader, message } from 'antd';
import styles from '@/pages/mylayout.less';
import { formatTreeData, mobileValidator } from '@/utils/handleNumber';
import { getGender } from '@/services/systemManage/employee';
import { addW, mr0, searchBtn } from '@/utils/cssStyle';
import searchForm from '@/pages/searchForm.less';
import { addAgent } from '@/services/userManage/userManage';
const FormItem = Form.Item;

const Add = ({ form, edit, setA, init,setEdit }) => {
  const { getFieldDecorator, resetFields, validateFields } = form;
  const [area, setArea] = useState([]);
  useEffect(() => {
    getGender({ codes: 'area' }).then(r => {
      formatTreeData(r.data.area.dicts, 'dictId');
      setArea(r.data.area.dicts);
    });
  }, []);
  const clear=()=>{
    setA('1');
    resetFields();
    setEdit({})
  }
  const handleAdd = () => {
    validateFields((e, v) => {
      if (!e) {
        addAgent({ ...v, agentId: edit.agentId ? edit.agentId : null }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            init();
            clear()
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };

  return (
    <div className={styles.wrapper} style={addW}>
      <h1 className={styles.addTitle}>{`- ${edit.agentId?"编辑":"新增"}代理 -`}</h1>
      <Row gutter={24}>
        <Form className={searchForm.searchForm}>
          <Col span={24}>
            <FormItem label="代理类型">
              {getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                    message: '请选择代理类型',
                  },
                ],
              })(
                <Radio.Group placeholder="请选择" >
                  <Radio value={"0"}>个人</Radio>
                  <Radio value={"1"}>企业</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="联系人">
              {getFieldDecorator('linkman', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系人',
                  },
                ],
              })(<Input allowClear placeholder="请输入联系人" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="联系方式">
              {getFieldDecorator('linkMobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入联系方式',
                  },
                  {
                    validator: mobileValidator,
                  },
                ],
              })(<Input allowClear placeholder="请输入联系方式" />)}
            </FormItem>
          </Col>
          <Col span={12}>
              <FormItem label="企业名称">
                {getFieldDecorator('companyName')(<Input allowClear placeholder="输入企业名称" />)}
              </FormItem>
            </Col>
          <Col span={12}>
            <FormItem label="所在地区">
              {getFieldDecorator('hh', {
                rules: [
                  {
                    required: true,
                    message: '请选择所在地区',
                  },
                ],
              })(<Cascader options={area} placeholder="请选择所在地区" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="负责区域">
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: '请输入负责区域',
                  },
                ],
              })(<Input allowClear placeholder="请输入负责区域" />)}
            </FormItem>
          </Col>
        </Form>
      </Row>
      <Row>
        <Col span={24} style={searchBtn}>
          <Button type="primary" onClick={handleAdd}>保存</Button>
          <Button style={mr0} onClick={()=>clear()}>返回</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Form.create({
  mapPropsToFields(props) {
    return {
      type: Form.createFormField({
        value: props.edit.agentTypeCode,
      }),
      linkman: Form.createFormField({
        value: props.edit.realName,
      }),
      linkMobile: Form.createFormField({
        value: props.edit.mobile,
      }),
      companyName: Form.createFormField({
        value: props.edit.companyName,
      }),
      area: Form.createFormField({
        value: props.edit.fuzearea,
      }),
    };
  },
})(Add);
