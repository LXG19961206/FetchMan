import { makeObservable,makeAutoObservable, action, observable, computed, reaction, flow } from 'mobx'
import { RequestInfo } from '@/models/request'
import { RequestMethod } from '@/dicts/methods'
import qs from 'qs'
import { Param } from '@/models/param'
import { generate } from 'shortid'
import { request } from '@/util/http'
import { useRespStore } from './resp'

class RequestStore {

  constructor () {
    makeAutoObservable(this)
    if (!this.requests.length) {
      this.requests.push(this.currentViewRequest)
    }
  }

  requests: RequestInfo[] = []


  /**
   * 前端会缓存目前 tab 里的所有请求的信息
   * 但是当前展示的只有一个
   * 所以下方的所有 请求进行 增删改查的方法都是基于当前正在展示的那个请求进行的
   * 如果切换 tab 后，currentViewRequest 就会发生变化
   */

  currentViewRequest: RequestInfo = {
    id: (+new Date()),
    url: '',
    method: RequestMethod.Get,
    headers: {},
  }

  async execRequest () {
    const respStore = useRespStore()
    const resp = await request(this.currentViewRequest)
    respStore.setCurrentViewResp(resp)
  }

  setUrl (url: string) {
    this.currentViewRequest.url = url.trim()
  }

  setBinaryState (boo: boolean) {
    this.currentViewRequest.isBinary = boo
  }

  setFormDataState (boo: boolean) {
    this.currentViewRequest.isFormData = boo
  }

  setHeader (key: string, value: string) {
    if (!this.currentViewRequest.headers) {
      this.currentViewRequest.headers = {}
    }
    this.currentViewRequest.headers[key] = value
  }

  getHeaderValue (key: string) {
    if (!this.currentViewRequest.headers) {
      return ""
    }
    return this.currentViewRequest.headers[key]
  }

  setMethod (method: RequestMethod) {
    this.currentViewRequest.method = method
  }

  setBody (body: typeof XMLHttpRequest.prototype.response) {
    this.currentViewRequest.body = body
  }

  delBody () {
    this.currentViewRequest.body = ''
  }

  delHeader (key: string) {
    if (!this.currentViewRequest.headers) {
      this.currentViewRequest.headers = {}
    }
    delete this.currentViewRequest.headers[key]
  }

  get params () : Param [] {
    if (!this.currentViewRequest.url) {
      return []
    } else {
      const params = qs.parse(this.currentViewRequest.url.split('?')[1])
      return Object.entries(params).map(([key, value]) => ({
        name: key, value: value as string || "", id: generate()
      }))
    }
  }


}

export const reqStore = new RequestStore()
export const useRequestStore = () => reqStore