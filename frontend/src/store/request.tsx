import { makeObservable,makeAutoObservable, action, observable, computed, reaction, flow } from 'mobx'

class RequestStore {

  @observable
  url: string = ''

  @action
  setUrl (url: string) {
    this.url = url
  }

  @computed
  get fullUrl () {
    return `https://${this.url}`
  }

  @flow
  *updateUrlAsync () {
    this.setUrl('wwww.baidu.com')
  }

  constructor () {
    makeObservable(this)
  }

}