import { Tooltip, Select } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { BaseProps } from '@/models/base'
import addFile from '@/assets/addFile.png'
import { useEnvStore } from '@/store/var'
import { useEffect } from 'react'
import { Envs } from './envs'
import { observer } from 'mobx-react'
export default observer((props: BaseProps) => {

  const envStore = useEnvStore()

  useEffect(() => {
    envStore.getAllEnv()
  }, [])

  return (
    <div
      style={props.style} 
      className={style.wrapper}>
      <div className={style.toolbar}>
        <Tooltip
          content="Add a variable" 
          trigger='hover'>
          <div
            onClick={() => envStore.addEnv()}
            className={style.toolbar_item}>
            <img src={addFile} alt="" />
          </div>
        </Tooltip>
        <div
            className={style.toolbar_item}>
            <Select
              prefix="current:"
              onChange={(envId) => envStore.setCurrentEnv(envId as number)} 
              value={envStore.currentEnvId}>
              {
                envStore.env.map((item) => (
                  <Select.Option label={item.name} value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
      </div>
      <Envs></Envs>
    </div>
  )
})