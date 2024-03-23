import { makeAutoObservable, observable, autorun } from 'mobx'
import { RequestInfo } from '@/models/request'
import { Methods, RequestMethod } from '@/dicts/methods'
import qs from 'qs'
import { Param } from '@/models/param'
import shortid, { generate } from 'shortid'
import { request } from '@/util/http'
import { useRespStore } from './resp'
import { GetRequestById, UpdateRequestInfo, GetFolderIdByReqId, NativeMessageDialog } from '~/go/app/App'
import { SmartHeaders } from '@/dicts/headers'
import { useTabStore } from './tab'
import { useWorkplaceStore } from './workplace'
import { request as goRequest } from '~/go/models'
import { isNil, omit } from 'lodash'
import { useScriptStore } from './script'

const createBlankRequest = (record?: RequestInfo) => {
  console.log(record)
  return {
    url: record?.url || '',
    id: record?.id || 0,
    body: record?.body || '',
    headers: record?.headers,
    isBinary: record?.isBinary || false,
    isFormData: record?.isFormData || false,
    method: record?.method || Methods.get,
    isReferenced: record?.isReferenced || false,
    preScript: record?.preScript || '',
    postTestScript: record?.postTestScript || '',
    headerList: observable.array(
      Object.entries(record?.headers || {}).map(item => [...item, shortid.generate()])
    )
  }
}

class RequestStore {

  isPending = false

  constructor() {
    makeAutoObservable(this)
    autorun(() => {
      this.currentViewRequest.headers = this.getTheLastHeaders()
    })
  }

  async updateReqInfo(id: number) {
    const current = await GetRequestById(id);
    this.currentViewRequest = createBlankRequest(current);
  }

  async flushView (reqId: number) {
    const tabStore = useTabStore()
    const workplaceStore = useWorkplaceStore()
    const folderId = await GetFolderIdByReqId(reqId)
    tabStore.getAllWindow()
    workplaceStore.lsFilesOfFolder(folderId)
  }


  async swtichCurrent(id: number, tabId: number) {
    await this.syncReqInfoToServer()
    const current = await GetRequestById(id);
    const tabStore = useTabStore()
    if (current.id) {
      this.currentViewRequest = createBlankRequest(current);
    } else {
      NativeMessageDialog({
        Message: "This request has been removed.",
        Title: "Warning"
      })
      await tabStore.delTab(tabId)
      tabStore.getAllWindow()
    }
  }

  getTheLastHeaders () {
    const headers = this.currentViewRequest.headerList
    const res = {} as Record<string, string>
    if (headers?.length) {
      headers.forEach(([key, val]) => {
        res[key] = val
      })
    }
    return res
  }

  async syncReqInfoToServer() {
    const prevId = this.currentViewRequest.id || 0
    console.log(this.currentViewRequest)
    await UpdateRequestInfo(omit(this.currentViewRequest as goRequest.RequestRecord, 'headerList'))
    await this.flushView(prevId || 0)
  }

  /**
   * 前端会缓存目前 tab 里的所有请求的信息
   * 但是当前展示的只有一个
   * 所以下方的所有 请求进行 增删改查的方法都是基于当前正在展示的那个请求进行的
   * 如果切换 tab 后，currentViewRequest 就会发生变化
   */

  currentViewRequest: RequestInfo = createBlankRequest()

  async execRequest() {
    const scriptStore = useScriptStore()
    const respStore = useRespStore()
    if (!this.currentViewRequest) return
    await this.syncReqInfoToServer()
    await scriptStore.execBeforeReqScript(this.currentViewRequest.preScript)
    const reqId = this.currentViewRequest.id || 0
    respStore.wait(reqId)
    const resp = await request(omit(this.currentViewRequest, 'headerList'))
    respStore.setCurrentViewResp(resp, reqId)
    respStore.removePendingTarget(reqId)
    this.updateReqInfo(reqId)
    await scriptStore.execAfterReqScript(resp, this.currentViewRequest.postTestScript)
    this.flushView(reqId)
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

  getBody() {
    return this.currentViewRequest.body || ""
  }

  setFormDataState(boo: boolean) {
    if (!this.currentViewRequest) return
    this.currentViewRequest.isFormData = boo
  }

  setHeader(item: string[], key: string | void, value: string | void) {
    if (!this.currentViewRequest) return
    if (isNil(key)) {
      item[1] = value as string
    } else {
      item[0] = key as string
    }
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

  delHeader(item: string[]) {
    if (!this.currentViewRequest) return
    this.currentViewRequest.headerList = (
      this.currentViewRequest.headerList?.filter(header => header !== item)
    )
  }

  addHeader (name ='', value = "") {
    const prev = this.currentViewRequest.headerList?.find(header => header[0] === name)
    if (prev) {
      this.setHeader(prev, name, value)
    } else {
      this.currentViewRequest.headerList?.push([name, value, shortid.generate()])
    }
  }

  setContentType(type: string) {
    if (!this.currentViewRequest) return
    const target = this.currentViewRequest.headerList?.find(([key]) => key === SmartHeaders.ContentType)
    if (target) {
      target[1] = type
    } else {
      this.addHeader(SmartHeaders.ContentType, type)
    }

  }


  getContentType() {
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

  setPreScript (scriptStr: string) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.preScript = scriptStr
    this.syncReqInfoToServer()
  }

  setPostTestScript (scriptStr: string) {
    if (!this.currentViewRequest) return 
    this.currentViewRequest.postTestScript = scriptStr
    this.syncReqInfoToServer()
  }


}

export const reqStore = new RequestStore()
export const useRequestStore = () => reqStore