import { makeAutoObservable } from 'mobx'
import { Resp } from '@/models/resp'
import { useTabStore } from './tab'

class RespStore {

  respMap = {} as Record<string, Resp>
  pendingList = [] as number []

  wait (id: number) {
    this.pendingList = [...this.pendingList, id] 
  }

  get currentView () {
    const reqId = useTabStore().currentViewReqId
    if (!reqId) return null
    return this.respMap[reqId]
  }

  get shouldRespRender () {
    const tabStore = useTabStore()
    const reqId = tabStore.currentViewReqId || 0
    return !!this.respMap[reqId] || this.pendingList.includes(reqId)
  }

  removePendingTarget (id: number) {
    this.pendingList = this.pendingList.filter((item) => item !== id)
  }

  constructor () {
    makeAutoObservable(this)
  }

  setCurrentViewResp = (resp: Resp, id: number) => {
    Reflect.set(this.respMap, id, resp)
  }

  removeResp (id: number) {
    delete this.respMap[id]
  }

}

export const respStore = new RespStore()
export const useRespStore = () => respStore