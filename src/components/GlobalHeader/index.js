import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import headerLogo from '@/assets/images/index_logo.png';
import collLogo from '@/assets/images/big_logo.png';
import { connect } from 'dva';

class GlobalHeader extends PureComponent {
  state = {
    selectKey: '/dashboard',
  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  onClickMenu = e => {
    let id = e.target.id || e.target.parentNode.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/saveSelectMenu',
      payload: {
        selectKey: id,
      },
    });
    this.setState({
      selectKey: id,
    });
  };

  render() {
    const { selectKey } = this.state;
    const { collapsed, isMobile, logo, menuData } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <img
          src={collapsed ? collLogo : headerLogo}
          className={collapsed ? styles.collLogo : styles.headerLogo}
          onClick={this.toggle}
        />
        {/*<span className={styles.trigger}>*/}
        {/*  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />*/}
        {/*</span>*/}
        <ul className={styles.topMenu} onClick={this.onClickMenu}>
          {menuData &&
            menuData.map(i => (
              <li
                key={i.path}
                id={i.path}
                style={{
                  backgroundColor: i.path == selectKey ? '#4EA2FF' : '',
                  borderRadius: '8px',
                }}
              >
                <Icon id={i.path} type={i.icon} />
                <h6 id={i.path}>{i.name}</h6>
              </li>
            ))}
        </ul>
        <RightContent {...this.props} />
      </div>
    );
  }
}
export default connect(({ menu }) => ({
  menu,
}))(GlobalHeader);
