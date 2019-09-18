import React from 'react';
import styles from './relation.less';
class AgentRelationship extends React.Component {
  render() {
    const { info } = this.props;
    return (
      <>
        <ul className={styles.agentUl}>
          <li>
            <p>总代理</p>
            <span>{info.oneAgentName ? info.oneAgentName : '无'}</span>
          </li>
          <li>
            <p>1级代理</p>
            <span>{info.twoAgentName ? info.twoAgentName : '无'}</span>
          </li>
          <li>
            <p>2级代理</p>
            <span>{info.threeAgentName ? info.threeAgentName : '无'}</span>
          </li>
          <li>
            <p>3级代理</p>
            <span>{info.fourAgentName ? info.fourAgentName : '无'}</span>
          </li>
          {/*<li>*/}
          {/*  <p>商户</p>*/}
          {/*  <span>{info.sellerName ? info.sellerName : '无'}</span>*/}
          {/*</li>*/}
        </ul>
        <ul className={styles.agentUl}>
          <li>
            <p>联系方式</p>
            <span>{info.oneAgentPhone ? info.oneAgentPhone : '无'}</span>
          </li>
          <li>
            <p>联系方式</p>
            <span>{info.twoAgentPhone ? info.twoAgentPhone : '无'}</span>
          </li>
          <li>
            <p>联系方式</p>
            <span>{info.threeAgentPhone ? info.threeAgentPhone : '无'}</span>
          </li>
          <li>
            <p>联系方式</p>
            <span>{info.fourAgentPhone ? info.fourAgentPhone : '无'}</span>
          </li>
          {/*<li>*/}
          {/*  <p>联系方式</p>*/}
          {/*  <span>{info.sellerLinkTel ? info.sellerLinkTel : '无'}</span>*/}
          {/*</li>*/}
        </ul>
        <ul className={styles.agentUl}>
          <li>
            <p>总代理分润比例</p>
            <span>{info.oneAgentReward ? info.oneAgentReward + '%' : '无'}</span>
          </li>
          <li>
            <p>1级代理分润比例</p>
            <span>{info.twoAgentReward ? info.twoAgentReward + '%' : '无'}</span>
          </li>
          <li>
            <p>2级代理分润比例</p>
            <span>{info.threeAgentReward ? info.threeAgentReward + '%' : '无'}</span>
          </li>
          <li>
            <p>3级代理分润比例</p>
            <span>{info.fourAgentReward ? info.fourAgentReward + '%' : '无'}</span>
          </li>
          {/*<li>*/}
          {/*  <p>商户分润比例</p>*/}
          {/*  <span>{info.sellerReward ? info.sellerReward + '%' : '无'}</span>*/}
          {/*</li>*/}
        </ul>
      </>
    );
  }
}
export default AgentRelationship;
