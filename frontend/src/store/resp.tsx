import { makeObservable,makeAutoObservable, action, observable, computed, reaction, flow } from 'mobx'
import { RequestInfo } from '@/models/request'
import { RequestMethod } from '@/dicts/methods'
import qs from 'qs'
import { Param } from '@/models/param'
import { generate } from 'shortid'
import { Resp } from '@/models/resp'

class RespStore {

  constructor () {
    makeAutoObservable(this)
  }

  currentViewResp: Resp | null = null

  setCurrentViewResp = (resp: Resp) => {
    this.currentViewResp = resp
  }
  

}

export const respStore = new RespStore()
export const useRespStore = () => respStore