import React, { Component } from 'react';
import { Modal, Input, Form, Tree, message } from 'antd';
import { getTreeData } from '@/services/role';
const FormItem = Form.Item;
const { TreeNode } = Tree;
@Form.create({
  mapPropsToFields(props) {
    if (props.info) {
      return {
        roleName: Form.createFormField({
          value: props.info.roleName,
        }),
      };
    }
  },
})
class RoleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
    };
  }
  static getDerivedStateFromProps(props, state) {
    const {
      info: { viewIds, type },
      visible,
    } = props;
    if (viewIds && viewIds.length > 0 && state.checkedKeys.length === 0 && visible) {
      return {
        ...state,
        checkedKeys: viewIds,
      };
    } else return null;
  }
  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };
  componentDidMount() {
    getTreeData().then(res =>
      this.setState({
        treeData: res.data,
      })
    );
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} value={item.value}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  handleConfirm = () => {
    const {
      onOk,
      form: { validateFields },
    } = this.props;
    validateFields(['roleName'], (errors, values) => {
      if (!errors) {
        const { checkedKeys } = this.state;
        if (checkedKeys.length <= 0) {
          message.error('请先选择权限');
          return;
        }
        onOk({ ...values, viewIds: checkedKeys });
        this.props.form.resetFields();
        this.setState({
          expandedKeys: [],
          checkedKeys: [],
          selectedKeys: [],
        });
      }
    });
  };
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    this.props.form.resetFields();
    this.setState({
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
    });
  };
  //电话号码验证
  mobileValidator = (rule, value, callback) => {
    if (value) {
      const reg = /^1[3|4|5|6|7|8|9|0|2|1][0-9]{9}$/;
      if (!reg.test(value)) {
        callback('请输入正确的电话号码');
      }
    }
    callback();
  };
  changeKey = data => {
    data.forEach(item => {
      item.value = item.id;
      item.key = item.id;
      item.title = item.resourceName;
      if (item.children && item.children.length > 0) this.changeKey(item.children);
    });
  };
  render() {
    const { treeData } = this.state;
    const { visible, info } = this.props;
    const { getFieldDecorator } = this.props.form;
    this.changeKey(treeData);

    return (
      <Modal
        title={info.type === 'add' ? '新增' : info.type === 'edit' ? '编辑' : ''}
        visible={visible}
        onOk={this.handleConfirm}
        onCancel={this.handleCancel}
        width={650}
      >
        <Form layout="inline">
          <FormItem label="角色名称">
            {getFieldDecorator('roleName', {
              rules: [
                {
                  required: true,
                  message: '请输入角色名称',
                },
              ],
            })(<Input style={{ width: '150px' }} />)}
          </FormItem>
          <FormItem label="权限列表" style={{ display: 'block', marginLeft: '10px' }}>
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {this.renderTreeNodes(treeData)}
            </Tree>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default RoleModal;
