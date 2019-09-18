import React, { useState } from 'react';
import styles from './details.less';
import { Modal } from 'antd';
const DetailTab = ({ detail }) => {
  const [imgV, setImgV] = useState(false);
  return (
    <>
      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>订单信息</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>订单号：</li>
          <li>订单渠道：</li>
          <li>订单状态：</li>
          <li>租借时长：</li>
          <li>订单创建时间：</li>
          <li>客户ID：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
          <li>{detail.mobile}</li>
          <li>{detail.name}</li>
          <li>{detail.age}</li>
          <li>{detail.nickName}</li>
            <li >
            </li>
        </ul>
        <ul>
          <li>支付订单号：</li>
          <li>押金方式：</li>
          <li>订单单价：</li>
          <li>订单金额：</li>
          <li>绑定手机号：</li>
          <li></li>
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

      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>出借信息</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>商户名称：</li>
          <li>门店名称：</li>
          <li>门店所在地区：</li>
          <li>出借设备编号：</li>
          <li>出借仓位编号：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
          <li>{detail.mobile}</li>
          <li>{detail.name}</li>
          <li>{detail.age}</li>
          <li></li>
        </ul>
        <ul>
          <li>支付订单号：</li>
          <li>押金方式：</li>
          <li>订单单价：</li>
          <li>订单金额：</li>
          <li>绑定手机号：</li>
          <li></li>
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

      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>BD/代理信息</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>BD/代理名称：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
        </ul>
        <ul>
          <li>BD/代理联系方式：</li>
        </ul>
        <ul>
          <li>{detail.userSource}</li>
        </ul>
      </div>

      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>优惠信息</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>优惠方式：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
        </ul>
        <ul>
          <li>优惠金额：</li>
        </ul>
        <ul>
          <li>{detail.userSource}</li>
        </ul>
      </div>

      <div className={styles.title}>
        <div className={styles.blue} />
        <h1>退款记录</h1>
      </div>
      <div className={styles.container}>
        <ul>
          <li>退款金额：</li>
        </ul>
        <ul>
          <li>{detail.userId}</li>
        </ul>
        <ul>
          <li>退款日期：</li>
        </ul>
        <ul>
          <li>{detail.userSource}</li>
        </ul>
        <ul>
          <li>操作人：</li>
        </ul>
        <ul>
          <li>{detail.userSource}</li>
        </ul>
      </div>
    </>
  );
};
export default DetailTab;
