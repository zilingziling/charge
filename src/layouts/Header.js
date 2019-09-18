import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Password from '@/pages/login/password';

const { Header } = Layout;

class HeaderView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      passwordV: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    const { onHandlePage } = this.props.location;
    // if (key === 'userCenter') {
    //   router.push('/account/center');
    //   onHandlePage({ key: '/account/center' });
    //   Return;
    // }
    // if (key === 'triggerError') {
    //   router.push('/exception/trigger');
    //   onHandlePage({ key: '/exception/trigger' });
    //   Return;
    // }
    // if (key === 'userinfo') {
    //   router.push('/account/settings');
    //   onHandlePage({ key: '/account/settings' });
    //   Return;
    // }
    if (key === 'logout') {
      dispatch({
        type: 'Login/logout',
        callback(res) {
          localStorage.removeItem('token');
          localStorage.removeItem('authority');
          localStorage.removeItem('userName');
          router.push('/login');
        },
      });
    }
    if (key === 'changePassword') {
      this.setState({
        passwordV: true,
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  onOk = () => {
    this.setState({
      passwordV: false,
    });
  };
  onCancel = () => {
    this.setState({
      passwordV: false,
    });
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const modalProps = {
      onOk: this.onOk,
      onCancel: this.onCancel,
    };
    const HeaderDom = visible ? (
      <>
        <Password visible={this.state.passwordV} {...modalProps} />
        <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
          {isTop && !isMobile ? (
            <TopNavHeader
              theme={navTheme}
              mode="horizontal"
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          ) : (
            <GlobalHeader
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          )}
        </Header>
      </>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  loadedAllNotices: global.loadedAllNotices,
  notices: global.notices,
  setting,
}))(HeaderView);
