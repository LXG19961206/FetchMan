package app

import (
	dbUtil "changeme/models"
	fileTable "changeme/models/fileLike"
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
	engine, err := dbUtil.GetSqLiteEngine()

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

func (a *App) RemoveCollection(id int64) {
	if engine, _ := dbUtil.GetSqLiteEngine(); engine != nil {
		var toDel []folderTable.Folder2Ancestor
		var toDelFolderIds = []int64{id}
		var toDelMiddleIds []int64

		engine.Where("folder_id = ?", id).Delete(&folderTable.Folder2Ancestor{})

		var err2 = engine.Find(&toDel, &folderTable.Folder2Ancestor{AncestorId: id})
		fmt.Printf("err2: %v\n", err2)

		lo.ForEach(toDel, func(item folderTable.Folder2Ancestor, i int) {
			if !lo.Contains(toDelMiddleIds, item.Id) {
				toDelMiddleIds = append(toDelMiddleIds, item.Id)
			}
			if !lo.Contains(toDelFolderIds, item.FolderId) {
				toDelFolderIds = append(toDelFolderIds, item.FolderId)
			}
			engine.Delete(&fileTable.FileLike{FolderId: item.FolderId})
		})

		var _, err3 = engine.In("id", toDelFolderIds).Delete(&folderTable.Folder{})
		fmt.Printf("err3: %v\n", err3)

		var _, err4 = engine.In("id", toDelMiddleIds).Delete(&folderTable.Folder{})
		fmt.Printf("err4: %v\n", err4)

	}
}
