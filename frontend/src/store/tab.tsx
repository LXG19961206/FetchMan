import { makeAutoObservable } from 'mobx'
import { tab } from '~/go/models'
import { ClientLsTabs, CreateNewTab, CloseTab } from '~/go/app/App'
import { useRequestStore } from './request'

class TabStore {

  tabs: tab.Tab[] = []

  currentId: number = 0

  constructor () {
    makeAutoObservable(this)
  }

  async getAllWindow () {
    this.tabs = await ClientLsTabs()
    return this.tabs
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