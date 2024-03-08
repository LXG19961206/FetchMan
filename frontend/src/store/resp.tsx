import { makeAutoObservable } from 'mobx'
import { Resp } from '@/models/resp'

class RespStore {

  currentViewResp: Resp | null = null
  isPending = false
  showView = false

  constructor () {
    makeAutoObservable(this)
  }

  setShowState (bool: boolean) {
    this.showView = bool
  }

  setPending (bool: boolean) {
    this.isPending = bool
  }

  setCurrentViewResp = (resp: Resp) => {
    this.currentViewResp = resp
  }
  
}

export const respStore = new RespStore()
export const useRespStore = () => respStore