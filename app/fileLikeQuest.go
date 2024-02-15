package app

import (
	dbUtil "changeme/models"
	fileLikeTable "changeme/models/fileLike"
	"errors"
)

func (a *App) LsRequestOfCollection(collectionId int64) []fileLikeTable.FileLike {
	var files []fileLikeTable.FileLike
	if collectionId == 0 {
		return nil
	}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Find(&files, &fileLikeTable.FileLike{FolderId: collectionId, Type: fileLikeTable.REQUEST})
		return files
	} else {
		return nil
	}
}

func (a *App) RenameFileLikeRequest(name string, id int64) error {
	if id == 0 {
		return errors.New("id is not apply")
	} else {
		err := dbUtil.BaseRename(name, id, &fileLikeTable.FileLike{})
		return err
	}
}

func (a *App) DelFileLikeRecord(id int64) error {
	if id == 0 {
		return errors.New("id is not apply")
	} else {
		err := dbUtil.BasePhyDel(id, &fileLikeTable.FileLike{})
		return err
	}
}

func (a *App) AddRequestToCollection(collectionId int64, name string) *fileLikeTable.FileLike {
	if collectionId == 0 {
		return nil
	}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {

		var file = &fileLikeTable.FileLike{
			FolderId: collectionId,
			Name:     name,
			Type:     fileLikeTable.REQUEST,
		}
		engine.Insert(file)

		return file

	} else {
		return nil
	}
}
