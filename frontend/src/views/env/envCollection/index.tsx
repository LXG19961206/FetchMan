import { Tooltip } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { BaseProps } from '@/models/base'
import addFile from '@/assets/addFile.png'
import { useEnvStore } from '@/store/var'
import { useEffect } from 'react'
import { Envs } from './envs'
export default (props: BaseProps) => {

  const envStore = useEnvStore()

  useEffect(() => {
    envStore.getAllEnv().then(() => {
      if (envStore.env.length) {
        envStore.setCurrent(envStore.env[0].id)        
      }
    })
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
      </div>
      <Envs></Envs>
    </div>
  )
}