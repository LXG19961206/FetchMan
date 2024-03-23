import { ObservableMap, makeAutoObservable, observable } from 'mobx'
import shortid from 'shortid'
import { IconCode, IconKey, IconTerminal, IconImage, IconClock, IconHash } from '@douyinfe/semi-icons'
import React from 'react'


type ToolItem = {
  name: string,
  label: string,
  id: string,
  icon: React.ReactNode,
  render: () => JSX.Element,
  allMulOpen: boolean // 是否允许多开
}

class ToolsStore {

  tools = observable.set<ToolItem>([])

  constructor () {
    makeAutoObservable(this)
  }

  resignTool (tool: ToolItem) {
    this.tools.add(tool)
  }

  createToolWindow (item: ToolItem) {
    const id = shortid.generate()
    this.currentOpenItems[id] = item
    this.currentId = id
    return id
  }

  setCurrent (id: string) {
    this.currentId = id
  }

  currentOpenItems: Record<string, ToolItem> = {}

  currentId = ""

}

export const toolsStore = new ToolsStore()
export const useToolsStore = () => toolsStore