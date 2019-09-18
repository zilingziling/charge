// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },
  treeShaking: true,
  // history: 'hash',
  publicPath: '/bms/',
  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
    },
    {
      path: '/login',
      component: './login/login',
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/dashboard' },

        // dashboard
        {
          path: '/dashboard',
          name: '工作台',
          icon: 'home',
          component: './Dashboard/Analysis.js',
        },
        // 运营管理
        {
          path: '/opeManage',
          name: '运营管理',
          icon: 'deployment-unit',
          routes: [
            // 订单管理
            {
              name: '订单管理',
              path: '/opeManage/order',
              icon: 'profile',
              routes: [
                // 充电宝订单
                {
                  path: '/opeManage/order/chargePalOrder',
                  name: '充电宝订单',
                  component: './ChargePalOrder/chargePalOrder.js',
                },
                // 充电线订单
                {
                  path: '/opeManage/order/chargeLineOrder',
                  name: '充电线订单',
                  component: './ChargeLineOrder/chargeLineOrder.js',
                },
                // 订单退款管理
                {
                  path: '/opeManage/order/orderRefund',
                  name: '订单退款管理',
                  component: './OrderRefund/orderRefund.js',
                },
                {
                  path: '/opeManage/order/refundR',
                  name: '退款记录',
                  icon: "read",
                  routes: [
                    {
                      path: '/opeManage/order/palRefundR',
                      component: './RefundR/palRefundR.js',
                      name: '充电宝退款记录',
                    },
                    {
                      path: '/opeManage/order/lineRefundR',
                      component: './RefundR/lineRefundR.js',
                      name: '充电线退款记录',
                    },
                   ]
                },
                {
                  path: '/opeManage/order/verification',
                  name: '验证码列表',
                  component: './Verification/verification.js',
                },
              ],
            },
            //  用户管理
            {
              path: '/opeManage/userManage',
              name: '用户管理',
              icon: 'team',
              routes: [
                {
                  path: '/opeManage/userManage/userList',
                  component: './UserManage/userList/userList.js',
                  name: '客户列表',
                },
                {
                  path: '/opeManage/userManage/agentList',
                  component: './UserManage/agentList/agentList.js',
                  name: '代理列表',
                },
                {
                  path: '/opeManage/userManage/shopList',
                  component: './UserManage/shopList/shopList.js',
                  name: '商户列表',
                },
                // {
                //   path: '/opeManage/userManage/serviceProList',
                //   component: './UserManage/serviceProList/serviceProList.js',
                //   name: '服务商列表',
                // },
              ],
            },
            //  门店管理
            {
              path: '/opeManage/shop',
              name: '门店管理',
              icon: 'shop',
              routes: [
                { path: '/opeManage/shop/public', component: './Shop/public.js', name: '公海门店' },
                {
                  path: '/opeManage/shop/private',
                  component: './Shop/private.js',
                  name: '私海门店',
                },
              ],
            },
            //  关系维护
            {
              path: '/opeManage/relationShip',
              name: '关系维护',
              icon: 'apartment',
              routes: [
                {
                  path: '/opeManage/relationShip/agentRelation',
                  component: './RelationShip/agentRelation.js',
                  name: '代理关系',
                },
                {
                  path: '/opeManage/relationShip/empAndStore',
                  component: './RelationShip/empAndStore.js',
                  name: '员工与门店关系',
                },
                {
                  path: '/opeManage/relationShip/shopAndStore',
                  component: './RelationShip/shopAndStore.js',
                  name: '商户与门店关系',
                },
                {
                  path: '/opeManage/relationShip/storeAndEquip',
                  component: './RelationShip/storeAndEquip.js',
                  name: '门店与设备关系',
                },
              ],
            },
          ],
        },
        // 仓储管理
        {
          path: '/warehouse',
          name: '仓储管理',
          icon: 'appstore',
          routes: [
            // 仓储管理
            {
              path: '/warehouse/storageManage',
              name: '仓储管理',
              icon: 'database',
              routes: [
                {
                  path: '/warehouse/storageManage/manage',
                  component: './StorageManage/manage/manage.js',
                  name: '仓库架构',
                },
                {
                  path: '/warehouse/storageManage/list',
                  component: './StorageManage/list/list.js',
                  name: '仓库列表',
                },
              ],
            },
            //  我的仓库
            {
              path: '/warehouse/myRepository',
              name: '我的仓库',
              icon: 'bank',
              routes: [
                {
                  path: '/warehouse/myRepository/inventoryList',
                  component: './MyRepository/inventoryList/inventoryList.js',
                  name: '库存列表',
                },
                {
                  path: '/warehouse/myRepository/topAgentEquip',
                  component: './MyRepository/topAgentEquip/topAgentEquip.js',
                  name: '总代理设备信息',
                },
                {
                  path: '/warehouse/myRepository/empAgentEquip',
                  component: './MyRepository/empAgentEquip/empAgentEquip.js',
                  name: '员工设备信息',
                },
              ],
            },
            // 我发起的申请
            {
              path: '/warehouse/applyByMe',
              name: '我发起的申请',
              icon: 'file',
              routes: [
                {
                  path: '/warehouse/applyByMe/replenish',
                  component: './ApplyByMe/replenish/replenish.js',
                  name: '仓库补货',
                },
                {
                  path: '/warehouse/applyByMe/return',
                  component: './ApplyByMe/return/return.js',
                  name: '仓库退货',
                },
              ],
            },
            // 我审批的申请
            {
              path: '/warehouse/approvedByMe',
              name: '我审批的申请',
              icon: 'folder',
              routes: [
                {
                  path: '/warehouse/approvedByMe/replenish',
                  component: './ApprovedByMe/replenish/replenish.js',
                  name: '仓库补货',
                },
                {
                  path: '/warehouse/approvedByMe/return',
                  component: './ApprovedByMe/return/return.js',
                  name: '仓库退货',
                },
                {
                  path: '/warehouse/approvedByMe/empApply',
                  component: './ApprovedByMe/empApply/empApply.js',
                  name: '员工设备申领',
                },
                {
                  path: '/warehouse/approvedByMe/empReturn',
                  component: './ApprovedByMe/empReturn/empReturn.js',
                  name: '员工设备退回',
                },
              ],
            },
            // 设备变更记录
            {
              path: '/warehouse/equipChangeRecord',
              name: '设备变更记录',
              icon: 'reconciliation',
              routes: [
                {
                  path: '/warehouse/equipChangeRecord/putInRecord',
                  component: './EquipChangeRecord/putInRecord/putInRecord.js',
                  name: '入库记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/agentOutRecord',
                  component: './EquipChangeRecord/agentOutRecord/agentOutRecord.js',
                  name: '代理出库记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/removeEquip',
                  component: './EquipChangeRecord/removeEquip/removeEquip.js',
                  name: '设备移除记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/maintainEquip',
                  component: './EquipChangeRecord/maintainEquip/maintainEquip.js',
                  name: '设备维护记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/changeEquip',
                  component: './EquipChangeRecord/changeEquip/changeEquip.js',
                  name: '编号替换记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/returnEquip',
                  component: './EquipChangeRecord/returnEquip/returnEquip.js',
                  name: '设备退回记录',
                },
                {
                  path: '/warehouse/equipChangeRecord/installEquip',
                  component: './EquipChangeRecord/installEquip/installEquip.js',
                  name: '设备部署记录',
                },
              ],
            },
          ],
        },
        // 1.0.1version
        {
          path: '/version1',
          icon: 'cloud-server',
          name: '1.0.1version',
          routes: [
            // 订单管理
            {
              path: '/version1/order',
              name: '订单管理',
              icon: 'profile',
              routes: [
                {
                  path: '/version1/order/underway',
                  component: './order/underway.js',
                  name: '进行中',
                },
                { path: '/version1/order/unpaid', component: './order/unpaid.js', name: '未支付' },
                {
                  path: '/version1/order/prepaid',
                  component: './order/prepaid.js',
                  name: '已支付',
                },
                {
                  path: '/version1/order/overtime',
                  component: './order/overtime.js',
                  name: '租借超时',
                },
                {
                  path: '/version1/order/discard',
                  component: './order/discard.js',
                  name: '订单废弃记录',
                },
              ],
            },
            // 用户管理
            {
              path: '/version1/user',
              name: '用户管理',
              icon: 'team',
              routes: [
                {
                  path: '/version1/user/userList',
                  component: './User/userList.js',
                  name: '用户列表',
                },
                {
                  path: '/version1/user/personalAgent',
                  component: './User/personalAgent/index.js',
                  name: '个人代理',
                },
                {
                  path: '/version1/user/companyAgent',
                  component: './User/companyAgent/index.js',
                  name: '企业代理',
                },
                {
                  path: '/version1/user/shopList',
                  component: './User/shop/shopList.js',
                  name: '商户列表',
                },
                {
                  path: '/version1/user/bankCards',
                  component: './User/bankCards.js',
                  name: '银行卡管理',
                },
              ],
            },
            // 解绑商户
            {
              path: '/version1/unbundle',
              name: '解绑商户',
              icon: 'shop',
              routes: [
                {
                  path: '/version1/unbundle/applyFor',
                  component: './unbundle/applyFor.js',
                  name: '解绑商户申请',
                },
                {
                  path: '/version1/unbundle/pass',
                  component: './unbundle/pass.js',
                  name: '解绑商户已通过',
                },
                {
                  path: '/version1/unbundle/fall',
                  component: './unbundle/fail.js',
                  name: '解绑商户未通过',
                },
              ],
            },
            {
              path: '/version1/withdraw',
              name: '提现管理',
              icon: 'wallet',
              routes: [
                {
                  path: '/version1/withdraw/toAudit',
                  component: './withdraw/toAudit.js',
                  name: '提现待审核',
                },
                {
                  path: '/version1/withdraw/pass',
                  component: './withdraw/pass.js',
                  name: '提现已通过',
                },
                {
                  path: '/version1/withdraw/fall',
                  component: './withdraw/fail.js',
                  name: '提现未通过',
                },
              ],
            },
            //  设备管理
            {
              path: '/version1/purchase',
              name: '采购管理',
              icon: 'schedule',
              routes: [
                {
                  path: '/version1/purchase/applyFor',
                  component: './purchase/applyFor.js',
                  name: '采购申请',
                },
                {
                  path: '/version1/purchase/pass',
                  component: './purchase/pass.js',
                  name: '采购申请已通过',
                },
                {
                  path: '/version1/purchase/fall',
                  component: './purchase/fail.js',
                  name: '采购申请未通过',
                },
                {
                  path: '/version1/purchase/Record',
                  component: './purchase/Record.js',
                  name: '采购单',
                },
              ],
            },
            {
              path: '/version1/outPut',
              name: '出入库管理',
              icon: 'interation',
              routes: [
                {
                  path: '/version1/output/batch',
                  component: './Output/batch/index.js',
                  name: '批次管理',
                },
                {
                  path: '/version1/output/notOut',
                  component: './Output/NotOut/notOut.js',
                  name: '未出库设备',
                },
                {
                  path: '/version1/output/outManage',
                  component: './Output/outManage/outManage.js',
                  name: '出库管理',
                },
                {
                  path: '/version1/output/outRecord',
                  component: './Output/outRecord.js',
                  name: '出库记录',
                },
                {
                  path: '/version1/output/scrapped',
                  component: './Output/scrapped.js',
                  name: '已报废的设备',
                },
              ],
            },
            {
              path: '/version1/AlreadyOut',
              name: '已出库设备',
              icon: 'export',
              routes: [
                {
                  path: '/version1/alreadyOut/configured',
                  component: './AlreadyOut/configured/configured.js',
                  name: '已部署设备',
                },
                {
                  path: '/version1/alreadyOut/notConfigured',
                  component: './AlreadyOut/notConfigured/notConfigured.js',
                  name: '未部署设备',
                },
              ],
            },
            // 冻结设备
            {
              path: '/version1/freeze',
              name: '冻结设备',
              icon: 'money-collect',
              routes: [
                {
                  path: '/version1/freeze/applyFor',
                  component: './freeze/applyFor.js',
                  name: '待回款设备',
                },
                {
                  path: '/version1/freeze/pass',
                  component: './freeze/pass.js',
                  name: '已回款设备',
                },
              ],
            },
            {
              path: '/version1/lose',
              name: '设备预警及遗失',
              icon: 'alert',
              routes: [
                {
                  path: '/version1/lose/applyFor',
                  component: './lose/warning.js',
                  name: '预警设备列表',
                },
                { path: '/version1/lose/pass', component: './lose/lost.js', name: '遗失设备列表' },
              ],
            },
            {
              path: '/version1/Record',
              name: '设备操作记录',
              icon: 'hdd',
              routes: [
                {
                  path: '/version1/Record/recall',
                  component: './Record/recall.js',
                  name: '设备撤回记录',
                },
                {
                  path: '/version1/Record/replace',
                  component: './Record/replace.js',
                  name: '设备替换记录',
                },
                {
                  path: '/version1/Record/scrap',
                  component: './Record/scrap.js',
                  name: '设备报废记录',
                },
                {
                  path: '/version1/Record/assign',
                  component: './Record/assign.js',
                  name: '设备部署记录',
                },
              ],
            },
            //   小宝管理
            {
              path: '/version1/chargeBaby',
              name: '小宝管理',
              icon: 'api',
              routes: [
                {
                  path: '/version1/chargeBaby/batchBaby',
                  component: './chargeBaby/batchBaby/index.js',
                  name: '批次管理',
                },
                {
                  path: '/version1/chargeBaby/notOutBaby',
                  component: './chargeBaby/notOutBaby/notOutBaby.js',
                  name: '未出库小宝',
                },
                {
                  path: '/version1/chargeBaby/outBaby',
                  component: './chargeBaby/outBaby/outBaby.js',
                  name: '小宝出库',
                },
                {
                  path: '/version1/chargeBaby/babyOutRecord',
                  component: './chargeBaby/babyOutRecord.js',
                  name: '小宝出库记录',
                },
                {
                  path: '/version1/chargeBaby/onlineBaby',
                  component: './chargeBaby/onlineBaby.js',
                  name: '在线的小宝',
                },
                {
                  path: '/version1/chargeBaby/offlineBaby',
                  component: './chargeBaby/offlineBaby.js',
                  name: '离线的小宝',
                },
                {
                  path: '/version1/chargeBaby/purchasedBaby',
                  component: './chargeBaby/purchasedBaby.js',
                  name: '被购买的小宝',
                },
                {
                  path: '/version1/chargeBaby/agentFillBaby',
                  component: './chargeBaby/agentFillBaby.js',
                  name: '代理补宝情况',
                },
              ],
            },
            //  数据分析
            {
              path: '/version1/reportForms',
              name: '报表管理',
              icon: 'file-text',
              routes: [
                {
                  path: '/version1/ReportForms/orderForm',
                  component: './ReportForms/orderForm.js',
                  name: '订单报表',
                },
                {
                  path: '/version1/ReportForms/rewardDetail',
                  component: './ReportForms/rewardDetail.js',
                  name: '分润明细',
                },
                {
                  path: '/version1/ReportForms/platform',
                  component: './ReportForms/platform.js',
                  name: '平台收入明细',
                },
              ],
            },
            {
              path: '/version1/authority',
              name: '权限管理',
              icon: 'idcard',
              routes: [
                {
                  path: '/version1/authority/role',
                  component: './Authority/role.js',
                  name: '角色管理',
                },
                {
                  path: '/version1/authority/admin',
                  component: './Authority/admin.js',
                  name: '管理员管理',
                },
              ],
            },
            {
              path: '/version1/systemConfig',
              name: '系统配置',
              icon: 'setting',
              routes: [
                {
                  path: '/version1/systemConfig/configInfo',
                  component: './SystemConfig/configInfo.js',
                  name: '配置参数',
                },
                {
                  path: '/version1/systemConfig/devicePrice',
                  component: './SystemConfig/devicePrice.js',
                  name: '设备单价',
                },
                {
                  path: '/version1/systemConfig/deviceManage',
                  component: './SystemConfig/deviceManage',
                  name: '设备管理',
                },
                {
                  path: '/version1/systemConfig/logs',
                  component: './SystemConfig/logs.js',
                  name: '操作日志',
                },
              ],
            },
            // 设备管理
            {
              path: '/version1/salesmanEquipment',
              name: '业务员设备管理',
              icon: 'export',
              routes: [
                {
                  path: '/version1/salesmanEquipment/equipped',
                  component: './SalesmanEquipment/equipped.js',
                  name: '业务员已部署设备',
                },
                {
                  path: '/version1/salesmanEquipment/equipPrice',
                  component: './SalesmanEquipment/equipPrice.js',
                  name: '设备单价管理',
                },
              ],
            },
            // 内容管理
            {
              path: '/version1/content',
              name: '内容管理',
              icon: 'book',
              routes: [
                {
                  path: '/version1/content/platform',
                  component: './Content/platform/platform.js',
                  name: '平台消息',
                },
              ],
            },
            // 系统管理
            {
              path: '/version1/systemManage',
              name: '系统管理',
              icon: 'appstore',
              routes: [
                {
                  path: '/version1/systemManage/dictionary',
                  component: './SystemManage/dictionary/dicType.js',
                  name: '数据词典',
                },
                {
                  path: '/version1/systemManage/employee',
                  component: './SystemManage/employee/employee.js',
                  name: '员工管理',
                },
                {
                  path: '/version1/systemManage/position',
                  component: './SystemManage/position.js',
                  name: '职位管理',
                },
                {
                  path: '/version1/systemManage/userManage',
                  component: './SystemManage/userManage.js',
                  name: '用户管理',
                },
                {
                  path: '/version1/systemManage/role',
                  component: './SystemManage/role/role.js',
                  name: '角色管理',
                },
                {
                  path: '/version1/systemManage/menu',
                  component: './SystemManage/menu.js',
                  name: '菜单管理',
                },
                {
                  path: '/version1/systemManage/loginLog',
                  component: './SystemManage/loginLog/loginLog.js',
                  name: '登录日志',
                },
                {
                  path: '/version1/systemManage/operateLog',
                  component: './SystemManage/operateLog/operateLog.js',
                  name: '行为日志',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  proxy: {
    '/api': {
      // target:'http://192.168.0.196:8089',
      target: 'http://192.168.0.52:60129',
      // target: 'https://test.jzcdsc.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
