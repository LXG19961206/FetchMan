import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { javascript } from '@codemirror/legacy-modes/mode/javascript';
import { Fragment, useState } from 'react';
import style from './index.module.less'
import { inject } from 'mobx-react';
import { Tag, Banner } from '@douyinfe/semi-ui'


const codeSnippets = [

  {
    name: 'Get response data',
    code: `let respData = getData();`
  },
  {
    name: 'Get response data(as JSON)',
    code: `let respDataJSON = (() => {\n\ \ try {\n\ \ \ \ return JSON.parse(getData());\n\ \ } catch (e) {\n\ \ \ \ return null;\n\ \ }\n\})();`
  },
  {
    name: 'Get some env-variable current value',
    code: `let value = await getEnvVariable('someEnvVariableName');`
  },
  {
    name: 'Update some env-variable value',
    code: `await setEnvVariable('name', 'newValue');`
  },
  {
    name: 'Unset some env-variable value',
    code: `await setEnvVariable('name', '');`
  },
  {
    name: 'Send a request',
    code: `let resp = await fetch('http://yourhostname:yourport/yourpath', {});\n\nlet respJson = await resp.json();`
  }

]

export default () => {

  const [htmlStr, setHtmlStr] = useState("")

  const injectCode = (code: string) => {
    setHtmlStr(prev => {
      return prev + code + '\n\n'
    })
  }

  // const reqStore = useRequestStore()

  // useEffect(() => {
  //   if (reqStore.getContentType().indexOf(ContentType.Html) > -1) {
  //     setHtmlStr(reqStore.currentViewRequest.body as string)
  //   }
  // }, [])

  // const sync = () => {
  //   setHtmlStr(newVal => {
  //     reqStore.setBody(newVal)
  //     reqStore.setContentType(
  //       ContentType.Html
  //     )
  //     return newVal
  //   })  
  // }

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
            onChange={setHtmlStr}
            value={htmlStr}
            height="100%"
            extensions={[StreamLanguage.define(javascript)]}
          />
        </div>
        <ul className={style.feature_list}>
          <p> CodeSnippets </p>
          {
            codeSnippets.map(item => (
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
