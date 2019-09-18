import React, { useState } from 'react';
import styles from './details.less';
import { Modal } from 'antd';
const Details = ({ detail }) => {
  const [imgV, setImgV] = useState(false);
  return (
    <>
      <Modal visible={imgV} footer={null} onCancel={() => setImgV(false)}>
        <img alt="example" style={{ width: '100%' }} src={detail.headimg} />
      </Modal>
      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>基础信息</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>客户ID：</li>
          <li>绑定手机号：</li>
          <li>姓名：</li>
          <li>年龄：</li>
          <li>微信/支付宝昵称：</li>
          <li>头像：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
          <li>{detail.mobile}</li>
          <li>{detail.name}</li>
          <li>{detail.age}</li>
          <li>{detail.nickName}</li>
          {detail.headimg ? (
            <li onClick={() => setImgV(true)}>
              <img src={detail.headimg} alt="userHead" />
            </li>
          ) : null}
        </ul>
        <ul>
          <li>客户来源：</li>
          <li>创建时间：</li>
          <li>性别：</li>
          <li>国家：</li>
          <li>地区：</li>
          <li>关注情况：</li>
        </ul>
        <ul>
          <li>{detail.userSource}</li>
          <li>{detail.createTime}</li>
          <li>{detail.sex}</li>
          <li>{detail.country}</li>
          <li>{detail.area}</li>
          <li>{detail.annation}</li>
        </ul>
      </div>
    </>
  );
};
export default Details;
