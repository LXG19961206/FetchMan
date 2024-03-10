import { makeAutoObservable, observable } from 'mobx'
import { env } from '~/go/models'
import { GetVarsByEnvId, LsAllEnv, AddVariable,ModifyVariable, AddEnv, RenameEnv, DelEnv, DelVars } from '~/go/app/App'

class EnvStore {

  constructor () {
    makeAutoObservable(this)
  }

  currentEdit = 0
  currentEnvId = 0
  env: env.Env[] = []
  varsOfCurrentEnv: env.Vars[] = []

  async getVarsByEnvId (envId: number) {
    const resp = await GetVarsByEnvId(envId) || []
    this.varsOfCurrentEnv = resp
  }


  async setCurrent (id: number) {
    this.currentEnvId = id
    await this.getVarsByEnvId(id)
  }

  async getAllEnv () {
    const resp = await LsAllEnv() || []
    this.env = resp
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
    await this.getVarsByEnvId(this.currentEnvId)
  }

  async modifyVar (record: env.Vars) {
    await ModifyVariable(record.id ,record)
  }

  async addVariable () {
    await AddVariable(this.currentEnvId, "")
    await this.getVarsByEnvId(this.currentEnvId)
  }

}

export const envStore = new EnvStore()
export const useEnvStore = () => envStore