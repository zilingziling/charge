import React, { useState } from 'react';
import { Card, Modal, Table } from 'antd';
import styles from '@/pages/UserManage/userList/components/details.less';
const { Column } = Table;

const Details = ({ detail }) => {
  const [license, setL] = useState(false);
  const [card, setC] = useState(false);
  const [cardReverse, setCR] = useState(false);

  return (
    <>
      <Modal visible={card} footer={null} onCancel={() => setC(false)}>
        <img alt="example" style={{ width: '100%' }} src={detail.cardFront} />
      </Modal>
      <Modal visible={cardReverse} footer={null} onCancel={() => setCR(false)}>
        <img alt="example" style={{ width: '100%' }} src={detail.cardReverse} />
      </Modal>
      <Modal visible={license} footer={null} onCancel={() => setL(false)}>
        <img alt="example" style={{ width: '100%' }} src={detail.businessLicense} />
      </Modal>
      <div>
        <div className={styles.title}>
          <div className={styles.blue} />
          <h1>基础信息</h1>
        </div>
        <div className={styles.container}>
          <ul>
            <li>商户ID</li>
            <li>商户名称</li>
            <li>认证状态</li>
          </ul>
          <ul>
            <li>{detail.businessId}</li>
            <li>{detail.businessName}</li>
            <li>{detail.certificationState}</li>
          </ul>
          <ul>
            <li>商户来源</li>
            <li>绑定手机号码</li>
            <li>创建时间</li>
          </ul>
          <ul>
            <li>{detail.businessSource}</li>
            <li>{detail.businessPhone}</li>
            <li>{detail.createTime}</li>
          </ul>
        </div>
      </div>
      <div>
        <div className={styles.title}>
          <div className={styles.blue} />
          <h1>认证信息</h1>
        </div>
        <div className={styles.container}>
          <ul>
            <li>主体名称</li>
            <li>分成比例</li>
            <li>身份证正面照</li>
            <li>营业执照</li>
          </ul>
          <ul>
            <li>{detail.subjectName}</li>
            <li>{detail.reward ? detail.reward + '%' : ''}</li>
            {detail.cardFront ? (
              <li onClick={() => setC(true)}>
                <img src={detail.cardFront} alt="userHead" />
              </li>
            ) : null}
            {detail.businessLicense ? (
              <li onClick={() => setL(true)}>
                <img src={detail.businessLicense} alt="userHead" />
              </li>
            ) : null}
          </ul>
          <ul>
            <li>主体类型</li>
            <li />
            <li>身份证反面照</li>
            <li />
          </ul>
          <ul>
            <li>{detail.subjectType}</li>
            <li />
            {detail.cardReverse ? (
              <li onClick={() => setCR(true)}>
                <img src={detail.cardReverse} alt="userHead" />
              </li>
            ) : null}
            <li />
          </ul>
        </div>
      </div>
      <div>
        <div className={styles.title}>
          <div className={styles.blue} />
          <h1>日志记录</h1>
        </div>
        <Table
          bordered
          dataSource={[]}
          rowKey="dictTypeId"
          // pagination={pager}
          // onChange={handleTableChange}
          // loading={loading}
        >
          <Column title="时间" dataIndex="name" />
          <Column title="行为" dataIndex="code" />
          <Column title="操作人" dataIndex="createTime" />
          <Column title="比例变动" dataIndex="createUser" />
          <Column title="结果" dataIndex="hhh" />
          <Column title="意见" dataIndex="" />
        </Table>
      </div>
    </>
  );
};
export default Details;
