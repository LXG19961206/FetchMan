import { Select, Input, Button } from '@douyinfe/semi-ui'
import style from './index.module.less'
import { RequestMethod } from '@/dicts/methods'
import { useRequestStore } from '@/store/request'
import { observer } from 'mobx-react'
export default observer(() => {

  const reqStore = useRequestStore()

  return (
    <div className={style.wrapper}>
      <Select
        filter
        size={"large"}
        defaultValue={RequestMethod.Get}
        onChange={val => reqStore.setMethod(val as RequestMethod)}
        style={{ width: 150 }}>
        {
          Object.values(RequestMethod).map(method => (
            <Select.Option
              size="large"
              key={method}
              value={method}> {method}
            </Select.Option>
          ))
        }
      </Select>
      <Input
        value={reqStore.currentViewRequest.url}
        onChange={val => reqStore.setUrl(val)}
        spellCheck={false}
        placeholder='Please enter your url' 
        size={"large"}>
      </Input>
      <Button
        disabled={!reqStore.currentViewRequest.url}
        className={style.button}
        onClick={() => reqStore.execRequest()}
        size={"large"}
        theme="solid"
        type='secondary'> Send
      </Button>
    </div>
  )
})