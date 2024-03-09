import { makeAutoObservable } from 'mobx'
import { RequestInfo } from '@/models/request'
import { Methods, RequestMethod } from '@/dicts/methods'
import qs from 'qs'
import { Param } from '@/models/param'
import { generate } from 'shortid'
import { request } from '@/util/http'
import { useRespStore } from './resp'
import { GetRequestById, UpdateRequestInfo } from '~/go/app/App'
import { SmartHeaders } from '@/dicts/headers'



const createBlankRequest = (record?: RequestInfo) => {
  return {
    url: record?.url || '',
    id: record?.id || 0,
    body: record?.body || '',
    headers: record?.headers || {},
    isBinary: record?.isBinary || false,
    isFormData: record?.isFormData || false,
    method: record?.method || Methods.get,
  }
}

class RequestStore {

  constructor() {
    makeAutoObservable(this)
  }

  async updateReqInfo (id: number) {
    const current = await GetRequestById(id);
    this.currentViewRequest = createBlankRequest(current);
  }


  async swtichCurrent(id: number) {
    const current = await GetRequestById(id);
    await UpdateRequestInfo(this.currentViewRequest as any)
    this.currentViewRequest = createBlankRequest(current);
  }


  /**
   * 前端会缓存目前 tab 里的所有请求的信息
   * 但是当前展示的只有一个
   * 所以下方的所有 请求进行 增删改查的方法都是基于当前正在展示的那个请求进行的
   * 如果切换 tab 后，currentViewRequest 就会发生变化
   */

  currentViewRequest: RequestInfo = createBlankRequest()

  async execRequest() {
    if (!this.currentViewRequest) return 
    const reqId = this.currentViewRequest.id || 0
    const respStore = useRespStore()
    respStore.wait(reqId)
    const resp = await request(this.currentViewRequest)
    respStore.setCurrentViewResp(resp, reqId)
    respStore.removePendingTarget(reqId)
    this.updateReqInfo(reqId)
  }

  setUrl(url: string) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.url = url.trim()
  }

  setId(id: number) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.id = id
  }

  setBinaryState(boo: boolean) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.isBinary = boo
  }

  getBody () {
    return this.currentViewRequest.body || ""
  }

  setFormDataState(boo: boolean) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.isFormData = boo
  }

  setHeader(key: string, value: string) {
    if (!this.currentViewRequest) return 
    if (!this.currentViewRequest.headers) {
      this.currentViewRequest.headers = {}
    }
    this.currentViewRequest.headers[key] = value
  }

  getHeaderValue(key: string) {
    if (!this.currentViewRequest.headers) {
      return ""
    }
    return this.currentViewRequest.headers[key] || ""
  }

  setMethod(method: RequestMethod) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.method = method
  }

  setBody(body: typeof XMLHttpRequest.prototype.response) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.body = body
  }

  delBody() {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.body = ''
  }

  delHeader(key: string) {
    if (!this.currentViewRequest) return 
    if (!this.currentViewRequest.headers) {
      this.currentViewRequest.headers = {}
    }
    delete this.currentViewRequest.headers[key]
  }

  getContentType () {
    if (!this.currentViewRequest?.headers) return ""
    return this.currentViewRequest.headers[SmartHeaders.ContentType] || ''
  }

  get params(): Param[] {
    if (!this.currentViewRequest) return []
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