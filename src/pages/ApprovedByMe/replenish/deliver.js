import React, { useEffect, useState, useRef } from 'react';
import styles from '@/pages/mylayout.less';
import { Button, Form, Input, Radio, Row, Col, message, Tag, Tooltip,Modal } from 'antd';
import { addW, mr0, searchBtn, w300 } from '@/utils/cssStyle';
import searchForm from '@/pages/searchForm.less';
import { request } from '@/utils/request';
import { addReplenish, scanDel } from '@/services/applyByMe';
const FormItem = Form.Item;
const DeliverTab = ({ form, init, setA, deliverInfo,setdeliver }) => {
  const [way, setWay] = useState(-1);
  const [tags, setTags] = useState([]);
  const [inputValue, setValue] = useState('');
  const [errorVisible, setEV] = useState(false);
  const [errorText, setText] = useState(false);
  const [six, set6] = useState(0);
  const [twelve, set12] = useState(0);
  const [line, setLine] = useState(0);
  const [box, setBox] = useState(0);
  const [cabinetA, setCabA] = useState(0);
  const [cabinetB_1, setB_1] = useState(0);
  const [cabinetB_2, setB_2] = useState(0);
  const inputEl = useRef(null);
  const scanDevice = deviceId => {
    setEV(false);
    setText("");
    if (tags.find(tag => tag.deviceId === deviceId)) return;
    request(`/api/StorageDevices/${deliverInfo.sendStorageId}/${deviceId}`).then(r => {
      if (r.code === '000000') {
        setTags([...tags, { deviceId, deviceType: r.data.deviceTypeStr }]);
        inputEl.current.blur();
        setValue('');
        setEV(false);
        setText('');
        switch (r.data.deviceType) {
          case '6':
            set6(six + 1);
            break;
          case '12':
            set12(twelve + 1);
            break;
          case 'POWER_BANK':
            setBox(box + 1);
            break;
          case 'POWER_LW_A':
            setCabA(cabinetA + 1);
            break;
          case 'POWER_LINE':
            setLine(line + 1);
            break;
          case 'POWER_LW_B_1':
            setB_1(setB_1 + 1);
            break;
          case 'POWER_LW_B_2':
            setB_2(setB_2 + 1);
        }
      } else {
        if(r.msg){
          setEV(true);
          setText(r.msg);
        }else message.error("服务器错误！")
      }
    });
  };
  const onSelectWay = e => {
    if (e.target.value === 2) message.info('扫码请将输入法切换为英文！');
    setWay(e.target.value);
  };
  const { getFieldDecorator, resetFields, validateFields } = form;
  const clear = () => {
    resetFields();
  };
  const handleDelver = () => {
    validateFields((e, v) => {
      if (!e) {
        scanDel({ ...v,deviceObjectList:tags,replenishId:deliverInfo.replenishId }).then(r => {
          if (r.code === '000000') {
            message.success('操作成功');
            init();
            clear();
            dispatch({
              type: 'apply/getReplenish',
              p: {  per_page:10, page:1, order: 'DESC', sortby: 'createTime', type: 1 },
            });
          } else message.error(`操作失败:${r.msg}`, 6);
        });
      }
    });
  };
  const handleCancel = () => {
    if(tags.length>0){
      Modal.confirm({
        title: '确认',
        content: '返回将清空已录入数据,确认返回吗？',
        okText: '确认',
        cancelText: '取消',
        onOk:()=>{
          setA("1")
          clear()
          setTags([])
          setdeliver({})
        },
        onCancel:()=>{}
      });
    }else {
      clear();
      setA("1")
      setdeliver({})
    }
  };
  const handleInputChange = e => {
    setValue(e.target.value);
    if (
      e.target.value &&
      e.target.value.length === 47 &&
      e.target.value.includes('https') &&
      e.target.value.includes('id=')
    ) {
      let value = e.target.value.split('id=');
      setValue(value[1]);
      scanDevice(value[1]);
    }
    if (e.target.value && e.target.value.length === 48 && e.target.value.includes('Chargingline')) {
      let value = e.target.value.split('Chargingline/');
      setValue(value[1]);
      scanDevice(value[1]);
    }
    if (e.target.value && e.target.value.length === 12 && e.target.value.includes('JZCB')) {
      setValue(e.target.value);
      scanDevice(e.target.value);
    }
  };
  const handleClose = removedTag => {
    const newTags = tags.filter(tag => tag.deviceId !== removedTag.deviceId);
    setTags(newTags);
    switch (removedTag.deviceId.length) {
      case 16:
        set6(six - 1);
        break;
      case '12':
        set12(twelve + 1);
        break;
      case 'POWER_BANK':
        setBox(box + 1);
        break;
      case 'POWER_LW_A':
        setCabA(cabinetA + 1);
        break;
      case 11:
        setLine(line - 1);
        break;
      case 'POWER_LW_B_1':
        setB_1(setB_1 + 1);
        break;
      case 'POWER_LW_B_2':
        setB_2(setB_2 + 1);
    }
  };
  // 输入框确认
  const handleInputConfirm = () => {
    inputEl.current.focus();
  };
  return (
    <div className={styles.wrapper} style={addW}>
      <h1 className={styles.addTitle}>- 发货 -</h1>
      <Row gutter={24}>
        <Form className={searchForm.searchForm}>
          <Col span={24}>
            <FormItem label="发货仓库">
              {getFieldDecorator('storageId', {
                initialValue: deliverInfo.sendStorageId,
              })(
                <Radio.Group placeholder="请选择发货仓库">
                  <Radio value={deliverInfo.sendStorageId}>{deliverInfo.sendStorageName}</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="待发货数量">
              <ul className={styles.countUl}>
                <li>6口设备：{deliverInfo.deviceCountSix}台</li>
                <li>12口设备：{deliverInfo.deviceCountTwelve}台</li>
                <li>充电线：{deliverInfo.chargingLineCount}个</li>
                <li>充电宝：{deliverInfo.terminalCount}个</li>
                <li>机柜A型：{deliverInfo.cabinetCountA}台</li>
                <li>机柜B-1型：{deliverInfo.cabinetCountB1}台</li>
                <li>机柜B-2型：{deliverInfo.cabinetCountB2}台</li>
              </ul>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="已录入数量">
              <ul className={styles.countUl}>
                <li>6口设备：{six}台</li>
                <li>12口设备：{twelve}台</li>
                <li>充电线：{line}个</li>
                <li>充电宝：{box}个</li>
                <li>机柜A型：{cabinetA}台</li>
                <li>机柜B-1型：{cabinetB_1}台</li>
                <li>机柜B-2型：{cabinetB_2}台</li>
              </ul>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="出库方式">
                <Radio.Group placeholder="请选择出库方式" style={w300} onChange={onSelectWay}>
                  <Radio value={1}>导入Excel</Radio>
                  <Radio value={2}>扫码出库</Radio>
                </Radio.Group>
            </FormItem>
          </Col>
          {way === 1 ? (
            <Col span={24}>
              <FormItem label="出库文件">
                <Input style={w300} placeholder="请输入仓库名称" />
              </FormItem>
            </Col>
          ) : null}
          {way === 2 && (
            <Col span={24}>
              <FormItem label="设备">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {tags.map((tag, index) => {
                    return (
                      <Tag
                        style={{
                          width: 300,
                          height: 32,
                          marginRight: '10px',
                          marginTop: '5px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontSize: '16px',
                          paddingTop: '5px',
                        }}
                        key={tag.deviceId}
                        closable
                        onClose={e => {
                          e.preventDefault();
                          handleClose(tag);
                        }}
                      >
                        {tag.deviceId + `（${tag.deviceType}）`}
                      </Tag>
                    );
                  })}
                  <Tooltip placement="top" title="请录入设备编号，重复编号无法键入">
                    <Input
                      ref={inputEl}
                      type="text"
                      style={{ width: 170, marginTop: '5px' }}
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputConfirm}
                      placeholder="添加设备"
                      allowClear
                    />
                    {errorVisible && inputValue ? (
                      <p style={{ color: 'red', textAlign: 'left' }}>{errorText}</p>
                    ) : null}
                  </Tooltip>
                </div>
              </FormItem>
            </Col>
          )}
        </Form>
      </Row>
      <Row>
        <Col span={24} style={searchBtn}>
          <Button type="primary" onClick={handleDelver}>
            保存
          </Button>
          <Button style={mr0} onClick={handleCancel}>
            返回
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default Form.create()(DeliverTab);
