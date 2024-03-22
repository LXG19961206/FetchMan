import { makeAutoObservable } from 'mobx'
import { Resp } from '@/models/resp'
import { useRespStore } from './resp'
import { useEnvStore } from './var'
import { NativeMessageDialog } from '~/go/app/App'
import { reqStore, useRequestStore } from './request'
import { SmartHeaders } from '@/dicts/headers'


class ScriptStore {

  constructor() {
    makeAutoObservable(this)
  }

  codeSnippetsAfterReqeust = [
    {
      name: 'Get response data',
      code: `let resp = getData();`
    },
    {
      name: 'Get response data(as JSON)',
      code: `let json = (() => {\n\ \ try {\n\ \ \ \ return JSON.parse(getData());\n\ \ } catch (e) {\n\ \ \ \ return null;\n\ \ }\n\})();`
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
      code: `let resp = await fetch('http://yourhostname:yourport/yourpath', {});\rlet respJson = await resp.json();`
    }
  ]

  codeSnippetsBeforeReqeust = [
    {
      name: 'Set/update request header',
      code: `await setHeader('key', 'newValue');`
    },
    {
      name: 'Set/update ContentType',
      code: `await setHeader('${SmartHeaders.ContentType}', 'newValue');`
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
      code: `let resp = await fetch('http://yourhostname:yourport/yourpath', {});\rlet respJson = await resp.json();`
    }
  ]

  callbacksOfRequest = {

    getData () {
      const respStore = useRespStore()
      return respStore.currentView?.data
    },

    async getEnvVariable (name: string) {
      const envStore = useEnvStore()
      return await envStore.getVar(name)
    },

    async setEnvVariable (name: string, value: string) {
      const envStore = useEnvStore()
      await envStore.modifyVarByName(name, value)
    },

    async setHeader (key: string, value: string) {
      const reqStore = useRequestStore()
      reqStore.addHeader(key, value)
    },

  }

  execAfterReqScript(resp: Resp, scriptText: string) {

    if (!scriptText) return

    const args = "getData,setEnvVariable,getEnvVariable,statusCode,window,document"

    const dynamicFunction = this.createDynamicFunction(args, scriptText)

    window.onunhandledrejection = (e) => {
      NativeMessageDialog({
        title: 'script exec error !',
        message: e.reason
      })
      window.onunhandledrejection = null;
    }

    dynamicFunction(
      this.callbacksOfRequest.getData,
      this.callbacksOfRequest.setEnvVariable,
      this.callbacksOfRequest.getEnvVariable,
      resp.status,
      null,
      null
    )

  }

  async execBeforeReqScript(scriptText: string) {

    if (!scriptText) return

    const args = "setHeader,setEnvVariable,getEnvVariable,window,document"

    const dynamicFunction = this.createDynamicFunction(args, scriptText)

    window.onunhandledrejection = (e) => {
      NativeMessageDialog({
        title: 'script exec error !',
        message: e.reason
      })
      window.onunhandledrejection = null;
    }

    await (dynamicFunction(
      this.callbacksOfRequest.setHeader,
      this.callbacksOfRequest.setEnvVariable,
      this.callbacksOfRequest.getEnvVariable,
      null,
      null
    ));

  }

  createDynamicFunction(args: string, scriptText: string) {
    return new Function(
      ...args.split(","),
      `return (async (${args}) => {
        ${scriptText};
      })(${args});`
    )
  }

}

export const scriptStore = new ScriptStore()
export const useScriptStore = () => scriptStore