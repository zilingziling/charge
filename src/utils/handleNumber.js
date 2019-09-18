import { Tooltip } from 'antd';
import React from 'react';
import moment from "moment";

export function idSlice(num, length) {
  //这里用slice和substr均可
  return (Array(length).join('0') + num).slice(-length);
}
export function formatMoney(money) {
  return (money / 100).toFixed(2);
}
export function typeFormatter(text) {
  return text === 6 ? '6口5台' : text === 12 ? '12口11台' : '';
}
// 非必填电话验证
export function mobileValidator(rule, value, callback) {
  if (value) {
    const reg = /^1[3|4|5|6|7|8|9|0|2|1][0-9]{9}$/;
    if (!reg.test(value)) {
      callback('请输入正确的电话号码!');
    }
  }
  callback();
}
//身份证号验证
export function idCardValidator(rule, value, callback) {
  if (value) {
    const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(value)) {
      callback('请输入正确的身份证号!');
    }
  }
  callback();
}
export function formatTreeData(data, id, rest) {
  data.forEach(item => {
    item.value = item.payload[id];
    item.key = item.payload[id];
    item.label = item.title;
    if (rest && rest.length > 0) {
      rest.forEach(i => {
        item[i] = item.payload[i];
      });
    }
    delete item.payload;
    if (item.children && item.children.length > 0) formatTreeData(item.children, id, rest);
  });
}
export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
// 不能输入汉字
export function notChinese(rule, value, callback) {
  if (value) {
    if (/[\u4E00-\u9FA5]/g.test(value)) {
      callback(new Error('不能输入汉字!'));
    }
  }
  callback();
}
// 只能输入数字
export function onlyNumber(rule, value, callback) {
  if (value) {
    if (!/^[+]{0,1}(\d+)$/.test(value)) {
      callback(new Error('只能输入数字类型!'));
    }
  }
  callback();
}
const  toDecimal=(x) =>{
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}
export function formatterNum(num,flag){
  if(num){
    return (
      num.toString().length<=6?flag?num:toDecimal(num/100):
        <Tooltip placement="bottomLeft" title={toDecimal(num/100)}>
          <span>{num.slice(0,6)+"..."}</span>
        </Tooltip>
    )
  }
  else return toDecimal(0)
}
export function formatterTime(time) {
  return moment(time).format('YYYY-MM-DD')
}
