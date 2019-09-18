import React, { useState, Component } from 'react';
import { Form, Table, Input, Select, Button, Card, Divider, message } from 'antd';
import styles from '@/pages/mylayout.less';
import TypeSix from '@/pages/SystemConfig/deviceManage/components/typeSix';
import TypeTwelve from '@/pages/SystemConfig/deviceManage/components/typeTwelve';
import empty from '@/assets/empty.png';
import { searchBox } from '@/services/deviceManage';
const FormItem = Form.Item;
const emptyStyle = {
  marginLeft: 'calc(50% - 128px)',
  verticalAlign: 'middle',
};

@Form.create()
class Index extends Component {
  state = {
    type6: { stock: '', state: '', id: '' },
    type12: { stock: '', state: '', id: '' },
    type: '',
  };
  handleSearch = () => {
    this.props.form.validateFields(['id'], (err, value) => {
      if (!err) {
        searchBox(value.id).then(res => {
          if (res.code === '000000') {
            if (res.data.stock === 6) {
              this.setState({
                type: res.data.stock,
                type6: { ...res.data },
              });
            } else if (res.data.stock === 12) {
              this.setState({
                type12: { ...res.data },
                type: res.data.stock,
              });
            }
          } else message.error(`${res.msg}`);
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { type, type6, type12 } = this.state;
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.wrapper}>
          <Card className={styles.searchBar}>
            <Form layout="inline">
              <FormItem label="请输入设备编号">
                {getFieldDecorator('id')(<Input style={{ width: '150px' }} allowClear />)}
              </FormItem>
              <Button icon="search" type="primary" onClick={this.handleSearch}>
                查询
              </Button>
            </Form>
          </Card>
        </div>
        <Card>
          {type === 6 ? (
            <TypeSix data={type6 && type6} />
          ) : type === 12 ? (
            <TypeTwelve data={type12 && type12} />
          ) : (
            <img src={empty} style={emptyStyle} />
          )}
        </Card>
      </div>
    );
  }
}
export default Index;
