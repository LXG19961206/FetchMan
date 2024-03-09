import { makeAutoObservable } from 'mobx'
import { tab } from '~/go/models'
import { ClientLsTabs, CreateNewTab, CloseTab, RenameTab, DuplicateTab, CreateOrUseExistTab } from '~/go/app/App'
import { useRequestStore } from './request'

class TabStore {

  tabs: tab.Tab[] = []

  currentId: number = 0

  constructor () {
    makeAutoObservable(this)
  }

  get currentViewReqId () {
    return this.tabs.find(item => item.id === this.currentId)?.requestId
  }

  async createOrUseExist (id: number, name: string, tag: string) {
    await this.changeTab(0)
    const tabId = await CreateOrUseExistTab(id, name, tag)
    await this.getAllWindow()
    setTimeout(() => {
      this.changeTab(tabId)
    })
  }

  async duplicateTab (id: number) {
    this.tabs = await DuplicateTab(id)
  }

  async getAllWindow () {
    this.tabs = await ClientLsTabs()
    return this.tabs
  }

  async rename (name: string, id: number) {
    await RenameTab(name, id)
    await this.getAllWindow()
  }

  async changeTab (id: number) {

    if (+id === -1) {
      return await this.addTab()
    }

    this.currentId = id
    const reqStore = useRequestStore()
    const reqId = this.tabs.find(item => item.id === id)?.requestId
    if (reqId) {
      await reqStore.swtichCurrent(reqId)
    }
    await this.getAllWindow()
  }

  async addTab () {
    const newTab = await CreateNewTab()
    await this.getAllWindow()
    setTimeout(() => {
      this.changeTab(newTab.id)
    })
  }

  async delTab (id: number) {
    await CloseTab(id)
    await this.getAllWindow()
  }

}

export const tabStore = new TabStore()
export const useTabStore = () => tabStore