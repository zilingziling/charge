import React, { useEffect, useState } from 'react';
import { Cascader, Form, Input, Modal, TreeSelect, Checkbox } from 'antd';
import { formatTreeData, idCardValidator, mobileValidator, onlyNumber } from '@/utils/handleNumber';
import { getGender } from '@/services/systemManage/employee';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const w300 = {
  width: 300,
};
const Add = () => {
  const [area, setArea] = useState([]);
  useEffect(() => {
    getGender({ codes: 'area' }).then(r => {
      formatTreeData(r.data.area.dicts, 'dictId');
      setArea(r.data.area.dicts);
    });
  }, []);
  return (
    <Modal width={700} title={title} visible={visible} onCancel={handleClose} onOk={confirmModal}>
      <Form {...formItemLayout}>
        <FormItem label="仓库名称">
          {getFieldDecorator('staffId', {
            rules: [
              {
                required: true,
                message: '请输入仓库名称',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入仓库名称" style={w300} />)}
        </FormItem>
        <FormItem label="所属地区">
          {getFieldDecorator('area', {
            rules: [
              {
                required: true,
                message: '请输入所在地区',
              },
            ],
          })(<Cascader options={area} placeholder="请选择所在地区" style={w300} />)}
        </FormItem>
        <FormItem label="详细地址">
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: '请输入详细地址',
              },
              {
                max: 20,
                message: '长度不能超过20！',
              },
            ],
          })(<Input placeholder="请输入详细地址" style={w300} />)}
        </FormItem>
        <FormItem label="仓库负责人">
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: '请输入仓库负责人',
              },
            ],
          })(<Input placeholder="请输入仓库负责人" style={w300} />)}
        </FormItem>
        <FormItem label="上级仓库">
          {getFieldDecorator('ff')(<Input disabled style={w300} />)}
        </FormItem>
        <FormItem label="出库限制">
          {getFieldDecorator('delFlag', {
            rules: [
              {
                required: true,
                message: '请选择出库限制',
              },
            ],
          })(
            <Checkbox.Group>
              <Checkbox key={1} value={1}>
                相同省的代理
              </Checkbox>
              <Checkbox key={0} value={0}>
                不同省的代理
              </Checkbox>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem label="退货范围">
          {getFieldDecorator('hhh', {
            rules: [
              {
                required: true,
                message: '请选择退货范围',
              },
            ],
          })(
            <Checkbox.Group>
              <Checkbox key={1} value={1}>
                下级仓库
              </Checkbox>
              <Checkbox key={0} value={0}>
                上级仓库
              </Checkbox>
              <Checkbox key={2} value={2}>
                同级仓库
              </Checkbox>
            </Checkbox.Group>
          )}
        </FormItem>
        <FormItem label="补货范围">
          {getFieldDecorator('ddd', {
            rules: [
              {
                required: true,
                message: '请选择补货范围',
              },
            ],
          })(
            <Checkbox.Group>
              <Checkbox key={1} value={1}>
                下级仓库
              </Checkbox>
              <Checkbox key={0} value={0}>
                上级仓库
              </Checkbox>
              <Checkbox key={2} value={2}>
                同级仓库
              </Checkbox>
            </Checkbox.Group>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};
