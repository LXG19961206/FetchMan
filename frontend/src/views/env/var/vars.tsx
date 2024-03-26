import { Input, Table, Tooltip, Notification, Spin } from '@douyinfe/semi-ui';
import { IconDelete, IconPlus, IconSearch, IconSave } from '@douyinfe/semi-icons';
import { useMemo, useRef, useState } from 'react';
import style from './index.module.less'
import { observer } from 'mobx-react';
import { useEnvStore } from '@/store/var';
import { RenderIf } from '@/components/headerless/renderIf';
import { env } from '~/go/models'
import { wait } from '@/util/sync'
import { useAutoHeight } from '@/hooks';



export type Source = {
  key: number,
  name: string,
  value: string,
}[]

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: 200
  },
  // {
  //   title: 'defaultValue',
  //   dataIndex: 'defaultValue',
  // },
  {
    title: 'currentValue',
    dataIndex: 'currentValue',
  },
  {
    title: 'edit',
    dataIndex: 'edit',
    width: 120
  },
];




export default observer(() => {

  const envStore = useEnvStore()

  const { height, bindWrapper } = useAutoHeight()

  const [filterVal, setFilter] = useState('')


  const save = async (item: env.Vars) => {
    if (sameNameCheck(item)) { return }
    const id = Notification.success({ icon: <Spin></Spin>, content: 'record is saving', title: "Tips" })
    await envStore.modifyVar(item)
    await wait(1000)
    Notification.close(id)
  }

  const del = async (id: number) => {
    const tipId = Notification.success({ icon: <Spin></Spin>, content: 'record is deleting', title: 'Tips' })
    await envStore.delVar(id)
    await wait(1000)
    Notification.close(tipId)
  }

  const sameNameCheck = (item: env.Vars) => {
    const value = item.name
    const needTip = envStore.varsOfCurrentEnv.find(
      record => record !== item && record.name === value
    )
    if (needTip) {
      Notification.error({ 
        content: `"${item.name}" has been used`, 
        title: 'Tips'
      })
    }
    return needTip
  }

  const tableSource = useMemo(() => {
    return envStore.varsOfCurrentEnv
      .filter(item => !filterVal || item.name?.indexOf(filterVal) > -1)
      .map((item, i) => ({
        key: item.id,
        name: (
          <Input
            defaultValue={item.name}
            onInput={e => item.name = (e.target as HTMLInputElement).value}
            className={style.input}
            spellCheck={false}
            placeholder="enter variable name">
          </Input>
        ),
        // defaultValue: (
        //   <Input
        //     defaultValue={item.initialValue}
        //     onInput={e => item.initialValue = (e.target as HTMLInputElement).value}
        //     className={style.input}
        //     placeholder="enter default value"
        //     spellCheck={false}>
        //   </Input>
        // ),

        currentValue: (
          <Input
            defaultValue={item.value}
            onInput={e => item.value = (e.target as HTMLInputElement).value}
            className={style.input}
            placeholder="enter current value"
            spellCheck={false}>
          </Input>
        ),

        edit: (
          <span
            className={style.operate_icon}>
            <Tooltip content="Delete this var">
              <IconDelete
                onClick={() => del(item.id)}
                color='lightblue'>
              </IconDelete>
            </Tooltip>
            <Tooltip content="Upadte this var">
              <IconSave onClick={() => save(item)}>
              </IconSave>
            </Tooltip>
          </span>
        )
      }))
  }, [envStore.varsOfCurrentEnv, filterVal])

  return (
    <div
      className={style.wrapper}>
      <Input
        defaultValue={filterVal}
        onBlur={(evt) => setFilter(evt.target.value)}
        spellCheck={false}
        className={style.search}
        placeholder={"filter vars"}
        prefix={<IconSearch></IconSearch>}>
      </Input>
      <Table
        scroll={{ y: height }}
        ref={(el) => {
          bindWrapper(el?.tableRef.current?.rootWrapRef.current)
        }}
        bordered
        pagination={false}
        size={"small"}
        sticky
        columns={columns}
        dataSource={tableSource}
        footer={
          <RenderIf when={!filterVal.length}>
            <div className={style.footer} onClick={() => envStore.addVariable()}>
              <IconPlus></IconPlus>
            </div>
          </RenderIf>
        }>
      </Table>
    </div>
  )
}
)
