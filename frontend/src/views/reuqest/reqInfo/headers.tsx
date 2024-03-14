import { Input, Table, AutoComplete } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useEffect, useMemo, useState } from 'react';
import { Size } from '@/dicts';
import style from './params.module.less'
import { observer } from 'mobx-react';
import { useRequestStore } from '@/store/request';
import shortid from 'shortid';
import { Header } from '@/models/headers';
import { SmartHeaders } from '@/dicts/headers';
import InjectVarInput from '@/views/env/injectVarInput';
import { useEnvStore } from '@/store/var';

const smartHeaderList = Object.values(SmartHeaders)

export type Source = {
  key: number,
  name: string,
  value: string,
}[]

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: 300
  },
  {
    title: 'value',
    dataIndex: 'value',
  },
  {
    title: 'edit',
    dataIndex: 'edit',
    width: 120
  },
];




export default observer(() => {

  const reqStore = useRequestStore()

  return (
    <Table
      className={style.table}
      bordered
      scroll={{ y: 400 }}
      pagination={false}
      size={Size.small}
      footer={
        <div className={style.footer} 
          onClick={() => reqStore.addHeader()}>
          <IconPlus></IconPlus>
        </div>
      }
      sticky
      columns={columns}
      dataSource={
        (reqStore.currentViewRequest.headerList || []).map((item, i) => {
          return ({
            key: item[2],
            name: (
              <AutoComplete
                className={style.input}
                onChange={(val: string | number) => reqStore.setHeader(item, val as string, undefined) }
                placeholder='Please enter key'
                data={smartHeaderList}
                value={item[0]}>
              </AutoComplete>
            ),
            value: (
              <InjectVarInput
                className={style.input}
                placeholder="Please enter value"
                spellCheck={false}
                onChange={(val: string | number) => reqStore.setHeader(item, undefined,val as string)}
                value={item[1]}>
              </InjectVarInput>
            ),
            edit: (
              <span
                className={style.operate_icon}>
                <IconDelete
                  color='lightblue'
                  onClick={() => { reqStore.delHeader(item) }}>
                </IconDelete>
              </span>
            )
          })
        })
      }>
    </Table>
  )
}
)
