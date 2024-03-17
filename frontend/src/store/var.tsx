import { makeAutoObservable, observable } from 'mobx'
import { env } from '~/go/models'
import { SetCurrent, GetVarsByEnvId, LsAllEnv, AddVariable,ModifyVariable, AddEnv, RenameEnv, DelEnv, DelVars } from '~/go/app/App'

class EnvStore {

  constructor () {
    makeAutoObservable(this)
  }

  currentEdit = 0
  viewEnvId = 0
  currentEnvId = 0
  env: env.Env[] = observable.array([])
  varsOfCurrentEnv: env.Vars[] = []

  async getVarsByEnvId (envId: number) {
    const resp = await GetVarsByEnvId(envId) || []
    this.varsOfCurrentEnv = resp
  }

  get currentVarDict () {
    return this.varsOfCurrentEnv.reduce((prev, item) => {
      return {
        ...prev, [item.name]: item.value
      }
    }, {})
  }

  getVar (name: string) {
    return this.varsOfCurrentEnv.find(item => item.name === name)?.value || '-'
  }


  async setEnvView (id: number) {
    this.viewEnvId = id
    await this.getVarsByEnvId(id)
  }

  async setCurrentEnv (id: number) {
    this.currentEnvId = id
    await SetCurrent(id)
  }

  async getAllEnv () {
    const resp = await LsAllEnv() || []
    const current = resp.find(item => item.isCurrent)
    this.env = resp
    if (current) { 
      this.currentEnvId = current.id
      this.setEnvView(current.id)
    }
  }

  async renameEnv (id: number, name: string) {
    this.currentEdit = 0
    await RenameEnv(id, name)
    await this.getAllEnv()
  }

  async addEnv () {
    const record = await AddEnv()
    await this.getAllEnv()
    this.currentEdit = record.id
  }

  async delEnv (id: number) {
    await DelEnv(id)
    await this.getAllEnv()
  }

  async delVar (id: number) {
    await DelVars(id)
    await this.getVarsByEnvId(this.viewEnvId)
  }

  async modifyVar (record: env.Vars) {
    await ModifyVariable(record.id ,record)
  }

  async addVariable () {
    await AddVariable(this.viewEnvId, "")
    await this.getVarsByEnvId(this.viewEnvId)
  }

}

export const envStore = new EnvStore()

envStore.getAllEnv()

export const useEnvStore = () => envStore