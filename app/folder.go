package app

import (
	dbUtil "changeme/models"
	folderTable "changeme/models/folder"
	"fmt"
	"log"

	"github.com/samber/lo"
)

func BindAncestors(current, parent folderTable.Folder) {
	engine, err := dbUtil.GetSqLiteEngine()
	if err != nil || parent.Id == 0 {
		return
	}
	engine.Insert(&folderTable.Folder2Ancestor{
		FolderId:      current.Id,
		AncestorId:    current.ParentId,
		AncestorLevel: 1,
	})
	var ancestorsOfParent []folderTable.Folder2Ancestor
	if err := engine.Find(&ancestorsOfParent, &folderTable.Folder2Ancestor{FolderId: parent.Id}); err != nil {
		log.Printf("err: %v\n", err)
	}
	lo.ForEach(ancestorsOfParent, func(item folderTable.Folder2Ancestor, i int) {
		go engine.Insert(&folderTable.Folder2Ancestor{
			FolderId:      current.Id,
			AncestorId:    item.AncestorId,
			AncestorLevel: item.AncestorLevel + 1,
		})
	})
}

func (a *App) AddCollectionFolder(name string, parentId int64) *folderTable.Folder {

	engine, _ := dbUtil.GetSqLiteEngine()

	exist, err := engine.Get(&folderTable.Folder{Name: name, ParentId: parentId})

	fmt.Printf("exist: %v\n", exist)

	fmt.Printf("err: %v\n", err)

	if exist {
		return nil
	}

	if err != nil {
		fmt.Printf("err: %v\n", err)
		return nil
	}

	var folder = &folderTable.Folder{
		Name:     name,
		ParentId: parentId,
		Type:     folderTable.COLLECTION,
	}

	var parent = &folderTable.Folder{}
	if parentId > 0 {
		var res, err = engine.ID(parentId).Get(parent)
		if err != nil {
			log.Printf("err: %v\n", err)
		} else {
			log.Printf("res: %v\n", res)
		}
		folder.ParentId = parentId
		folder.Depth = parent.Depth + 1
	}
	if _, err := engine.Insert(folder); err != nil {
		log.Fatal(err)
		return nil
	} else {
		BindAncestors(*folder, *parent)
	}
	engine.ID(folder.Id).Get(folder)
	return folder
}

func (a *App) LsCollectionFolder(parentId int64) []folderTable.Folder {
	var folders []folderTable.Folder
	engine, err := dbUtil.GetSqLiteEngine()
	if err == nil {
		if parentId > 0 {
			engine.Find(&folders, &folderTable.Folder{
				Type:     folderTable.COLLECTION,
				ParentId: parentId,
			})
		} else {
			engine.Where("type = ? and depth = ?", folderTable.COLLECTION, 0).Find(&folders)
		}
		return folders
	} else {
		return folders
	}
}

func (a *App) RenameFolder(newName string, id int64) {
	dbUtil.BaseRename(newName, id, &folderTable.Folder{})
}

/*
	   移除一个工作区，要删除很多东西
		 首先要根据中间表，找到工作区所有的 后代 工作区

		 然后找到后代工作区关联的所有文件
		 需要将这些文件也进行删除
		 文件又和请求是一对一的对应关系，因此请求也应该被删除
		 此外还有和请求关联的 tab 页也统统进行删除
*/
func (a *App) RemoveCollection(id int64) {

	if engine, _ := dbUtil.GetSqLiteEngine(); engine != nil {

		var toDel []folderTable.Folder2Ancestor
		var toDelFolderIds = []int64{id}
		var toDelMiddleIds []int64
		var toDelFileFolderIds = []int64{id}

		// 从中间表中找到所有和这个工作区有关的内容进行批量删除
		// 包括子文件夹、以及请求记录
		engine.Find(&toDel, &folderTable.Folder2Ancestor{AncestorId: id})
		lo.ForEach(toDel, func(item folderTable.Folder2Ancestor, i int) {
			if !lo.Contains(toDelMiddleIds, item.Id) {
				toDelMiddleIds = append(toDelMiddleIds, item.Id)
			}
			if !lo.Contains(toDelFolderIds, item.FolderId) {
				toDelFolderIds = append(toDelFolderIds, item.FolderId)
			}
		})

		for _, record := range toDel {
			toDelFileFolderIds = append(toDelFileFolderIds, record.FolderId)
		}

		BatchPhyDeleteFileLikeRequest(toDelFileFolderIds)
		var _, _ = engine.In("id", toDelFolderIds).Delete(&folderTable.Folder{})
		var _, _ = engine.In("id", toDelMiddleIds).Delete(&folderTable.Folder{})

	}
}
