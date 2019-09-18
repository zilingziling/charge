import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Select, Form, Input, DatePicker, Cascader } from 'antd';
import { formatTreeData, mobileValidator } from '@/utils/handleNumber';
import { getGender } from '@/services/systemManage/employee';
import { w300 } from '@/utils/cssStyle';
const FormItem = Form.Item;
const Option = Select.Option;
const mr20 = {
  marginRight: 20,
};
const w150 = {
  width: 150,
};

const Search = ({ form }) => {
  const { getFieldDecorator } = form;
  const [area, setArea] = useState([]);
  useEffect(() => {
    getGender({ codes: 'area' }).then(r => {
      formatTreeData(r.data.area.dicts, 'dictId');
      setArea(r.data.area.dicts);
    });
  }, []);
  return (
    <div className={styles.wrapper}>
      <Card className={styles.searchBar}>
        <Form layout="inline">
          <FormItem label="设备编号">
            {getFieldDecorator('name')(<Input placeholder="请输入仓库名称" style={w150} />)}
          </FormItem>
          <FormItem label="门店名称">
            {getFieldDecorator('name')(<Input placeholder="请输入门店名称" style={w150} />)}
          </FormItem>
          <FormItem label="商户名称">
            {getFieldDecorator('name')(<Input placeholder="请输入商户名称" style={w150} />)}
          </FormItem>
          <FormItem label="所属地区">
            {getFieldDecorator('area', {
              rules: [
                {
                  required: true,
                  message: '请选择所属地区',
                },
              ],
            })(<Cascader options={area} placeholder="请选择所在地区" style={w300} />)}
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
export default Form.create()(Search);
