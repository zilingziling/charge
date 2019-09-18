import React, { useEffect, useState } from 'react';
import { Divider, Table } from 'antd';
import Search from '@/pages/StorageManage/manage/components/search';
import { getGender, getPosTree } from '@/services/systemManage/employee';
import { formatTreeData } from '@/utils/handleNumber';
const right = {
  flexGrow: 1,
};
const mt20 = {
  marginTop: 20,
};
const Column = Table.Column;
const RightTable = () => {
  return (
    <div style={right}>
      <Search />
      <Table bordered>
        <Column
          title="操作"
          reder={t => (
            <>
              <a href="javascript:;">删除</a>
              <Divider type="vertical" />
              <a href="javascript:;">编辑</a>
            </>
          )}
        />
        <Column title="仓库名称" />
        <Column title="所属地区" />
        <Column title="详细地址" />
        <Column title="出库范围" />
        <Column title="仓库负责人" />
        <Column title="上级仓库" />
        <Column title="创建时间" />
        <Column title="操作人" />
      </Table>
    </div>
  );
};
export default RightTable;
