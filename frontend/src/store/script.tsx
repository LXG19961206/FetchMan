import { makeAutoObservable } from 'mobx'
import { Resp } from '@/models/resp'
import { useRespStore } from './resp'
import { useEnvStore } from './var'
import { NativeMessageDialog } from '~/go/app/App'



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

  callbacksAfterReq = {

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


  }

  execAfterReqScript(resp: Resp, scriptText: string) {

    if (!scriptText) return

    const dynamicFunction = new Function(
      "getData", 
      "setEnvVariable", 
      "getEnvVariable", 
      "statusCode", 
      `return (async (GetData, setEnvVariable, getEnvVariable, statusCode) => {
        ${scriptText};
      })(getData,setEnvVariable, getEnvVariable, statusCode);`
    )

    window.onunhandledrejection = (e) => {
      NativeMessageDialog({
        title: 'script exec error !',
        message: e.reason
      })
      window.onunhandledrejection = null;
    }

    dynamicFunction(
      this.callbacksAfterReq.getData,
      this.callbacksAfterReq.setEnvVariable,
      this.callbacksAfterReq.getEnvVariable,
      resp.status
    )

  }

}

export const scriptStore = new ScriptStore()
export const useScriptStore = () => scriptStore