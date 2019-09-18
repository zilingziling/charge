import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';

const { Footer } = Layout;
const footerStyle = { padding: 0 };
const FooterView = () => (
  <Footer style={footerStyle}>
    <GlobalFooter
      links={[
        {
          key: 'JZ',
          title: 'JZ',
          href: 'http://www.jzcdsc.com',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 京猪充电技术部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
