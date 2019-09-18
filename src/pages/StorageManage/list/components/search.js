import React, { useEffect, useState } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Card, Cascader, Form, Input } from 'antd';
import { getGender } from '@/services/systemManage/employee';
import { formatTreeData } from '@/utils/handleNumber';
const FormItem = Form.Item;
const mr20 = {
  marginRight: 20,
};
const w150 = {
  width: 150,
};
const w300 = {
  width: 300,
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
          <FormItem label="仓库名称">
            {getFieldDecorator('name')(<Input placeholder="请输入仓库名称" style={w150} />)}
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
