import { makeObservable,makeAutoObservable, action, observable, computed, reaction, flow } from 'mobx'
import { RequestInfo } from '@/models/request'
import { RequestMethod } from '@/dicts/methods'
import qs from 'qs'
import { Param } from '@/models/param'
import { generate } from 'shortid'
import { request } from '@/util/http'

class RequestStore {

  constructor () {
    makeAutoObservable(this)
    if (!this.requests.length) {
      this.requests.push(this.currentRequest)
    }
  }

  requests: RequestInfo[] = []

  url: string = ""

  currentRequest: RequestInfo = {
    id: (+new Date()).toString(),
    url: '',
    method: RequestMethod.Get,
    headers: {}
  }

  async execRequest () {
    return request(
      this.currentRequest
    )
  }

  setUrl (url: string) {
    this.currentRequest.url = url
    this.url = url
  }

  setBinaryState (boo: boolean) {
    this.currentRequest.isBinary = boo
  }

  setFormDataState (boo: boolean) {
    this.currentRequest.isFormData = boo
  }

  setHeader (key: string, value: string) {
    if (!this.currentRequest.headers) {
      this.currentRequest.headers = {}
    }
    this.currentRequest.headers[key] = value
  }

  setMethod (method: RequestMethod) {
    this.currentRequest.method = method
  }

  setBody (body: typeof XMLHttpRequest.prototype.response) {
    this.currentRequest.body = body
  }

  delBody () {
    this.currentRequest.body = ''
  }

  delHeader (key: string) {
    if (!this.currentRequest.headers) {
      this.currentRequest.headers = {}
    }
    delete this.currentRequest.headers[key]
  }

  get params () : Param [] {
    if (!this.currentRequest.url) {
      return []
    } else {
      const params = qs.parse(this.currentRequest.url.split('?')[1])
      console.log(params, 3333);
      return Object.entries(params).map(([key, value]) => ({
        name: key, value: value as string || "", id: generate()
      }))
    }
  }


}

export const reqStore = new RequestStore()
export const useRequestStore = () => reqStore