import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { javascript } from '@codemirror/legacy-modes/mode/javascript';
import { Fragment, useEffect, useState } from 'react';
import style from './index.module.less'
import { Tag, Banner } from '@douyinfe/semi-ui'
import { useScriptStore } from '@/store/script';
import { useRequestStore } from '@/store/request';


export default (props: {
  isPrev: boolean
}) => {

  const [scriptStr, setScriptStr] = useState("")
  const reqStore = useRequestStore()
  const scriptStore = useScriptStore()

  useEffect(() => {
    if (props.isPrev) {
      setScriptStr(reqStore.currentViewRequest.preScript)
    } else {
      setScriptStr(reqStore.currentViewRequest.postTestScript)
    }
  }, [])

  const injectCode = (code: string) => {
    setScriptStr(prev => {
      return prev + code + '\r'
    })
  }

  const sync = () => {
    setScriptStr(newVal => {
      if (props.isPrev) {
        reqStore.setPreScript(newVal)
      } else {
        reqStore.setPostTestScript(newVal)
      }
      return newVal
    })
  }


  return (
    <Fragment>
      <Banner
        type='warning'
        icon=''
        description={
          <p className={style.tips}>
            The code you've provided will be encapsulated within an asynchronously defined <Tag size='small' color='blue'> anonymous </Tag> function, enabling the direct utilization of the await keyword within it. It's important to note that many intrinsic operations in this context are asynchronous by default. Hence, if your script depends on such operations, ensure to appropriately prefix them with the <Tag size='small' color='blue'>await keyword</Tag> when <Tag size='small' color='blue'>necessary</Tag> for proper synchronization.
          </p>
        }>
      </Banner>
      <div className={style.wrapper}>
        <div className={style.script_code_after_req}>
          <CodeMirror
            placeholder={"// write your script here"}
            onBlur={sync}
            onChange={setScriptStr}
            value={scriptStr}
            height="100%"
            extensions={[StreamLanguage.define(javascript)]}
          />
        </div>
        <ul className={style.feature_list}>
          <p> CodeSnippets </p>
          {
            (
              props.isPrev ? scriptStore.codeSnippetsBeforeReqeust : scriptStore.codeSnippetsAfterReqeust
            ).map(item => (
              <li
                key={item.name}
                onClick={() => injectCode(item.code)}>
                {item.name}
              </li>
            ))
          }
        </ul>
      </div>
    </Fragment>
  )
}
