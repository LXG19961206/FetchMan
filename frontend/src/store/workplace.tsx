import { makeAutoObservable, observable } from 'mobx'
import { useTabStore } from './tab'
import { RenameFileLikeRequest, DelFileLikeRecord, AddRequestToCollection, LsRequestOfCollection, LsCollectionFolder, AddCollectionFolder, RenameFolder, RemoveCollection } from '~/go/app/App'
import { filelike, folder } from '~/go/models'
import shortid from 'shortid'


type Folder = folder.Folder & {
  isFold: boolean,
}

type FileLike = filelike.FileLike

class WorkplaceStore {

  public constructor () {
    makeAutoObservable(this)
  }

  currentEditRequestId = 0

  currentEditFolderId = 0

  currentViewFolderId = 0

  folderMap = observable.map<number, Folder []>()

  fileLikeMap = observable.map<number, FileLike []>()

  whichAreOpened = observable.set<number>()

  async lsTargetFolder (id: number = 0) {
    const res = await LsCollectionFolder(id || 0) || []
    const folders = res.map(node => ({
      ...node, 
      isFold: !this.whichAreOpened.has(node.id), 
      isRenaming: false
    }))
    this.folderMap.set(id, folders)
  }

  async lsFilesOfFolder (id: number = 0) {
    if (!id) return 
    const files = await LsRequestOfCollection(id)
    this.fileLikeMap.set(id, files)
  }

  async viewRequest (folderId: number, reqId: number, name: string, tag: string)  {
    const tabStore = useTabStore()
    this.currentViewFolderId = folderId
    tabStore.createOrUseExist(reqId, name, tag)
  }

  async renameRequest (name: string, id: number, folderId: number) {
    this.currentEditRequestId = 0
    await RenameFileLikeRequest(name, id)
    await this.lsFilesOfFolder(folderId)
  }

  async delRequest (id: number, folderId: number) {
    await DelFileLikeRecord(id)
    await this.lsFilesOfFolder(folderId)
  }

  async delFolder (id: number, parentId: number = 0) {
    await RemoveCollection(id)
    await this.lsTargetFolder(parentId)
    Promise.resolve().then(() => {
      this.delChildren(id)
    })
  }

  async delChildren (id: number) {
    if (id === 0) return 
    const chidren = this.folderMap.get(id)?.map(folder => folder.id)
    this.folderMap.delete(id)
    this.fileLikeMap.delete(id)
    if (chidren?.length) {
      chidren.forEach(item => this.delChildren(item))
    }
  }


  async reanemdFolder (name: string, id: number, parentId: number = 0) {
    this.currentEditFolderId = 0
    await RenameFolder(name, id)
    await this.lsTargetFolder(parentId)
  }

  async addFolder (parentId = 0) {
    const { id } = await AddCollectionFolder(
      `工作区${shortid.generate()}`, parentId
    )
    await this.lsTargetFolder(parentId)
    this.currentEditFolderId = id
  }

  async addRequest (folder: Folder) {
    const folderId = folder.id
    folder.isFold = false
    this.whichAreOpened.add(folderId)
    const { id } = await AddRequestToCollection(
      folderId, `新请求${shortid.generate()}`
    )
    await this.lsFilesOfFolder(folderId)
    this.currentEditRequestId = id
  }

  async toggleFolderStatus (node: Folder) {
    if (node.isFold) {
      this.whichAreOpened.add(node.id)
    } else {
      this.whichAreOpened.delete(node.id)
    }
    node.isFold = !node.isFold
  }


}

export const workplaceStore = new WorkplaceStore()
export const useWorkplaceStore = () => workplaceStore