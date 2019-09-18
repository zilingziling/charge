import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};
const filterNoneAllowResources = (allResources, allowResources, link) => {
  // 过滤 无限递归
  if (link.has(allResources)) {
    return;
  }
  link.add(allResources);
  if (allResources.path !== allowResources.path) {
    for (let key in allResources) {
      delete allResources[key];
    }
  } else {
    // 比较下级
    if (allResources.routes) {
      if (!allowResources.children) {
        allResources.routes = [];
      } else {
        allResources.routes = allResources.routes.filter(r => {
          for (const ar of allowResources.children) {
            if (r.path === ar.path) {
              filterNoneAllowResources(r, ar, link);
              return true;
            }
          }
          return false;
        });
      }
    }
  }
};
/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',
  state: {
    menuData: [],
    breadcrumbNameMap: {},
    selectMenu: null,
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      // 服务器端获取菜单数据
      let routesFromBg = JSON.parse(localStorage.getItem('authority'));
      const { routes, authority } = payload;
      // const all = { path: '/', routes: routes };
      // filterNoneAllowResources(all, { path: '/', children: routesFromBg }, new Set());
      // const menuData = filterMenuData(memoizeOneFormatter(all.routes, authority));
      const menuData = formatter(routes, authority);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveSelectMenu(state, { payload }) {
      // state.selectMenu = payload.selectKey;
      return {
        ...state,
        selectMenu: payload.selectKey,
      };
    },
  },
};
