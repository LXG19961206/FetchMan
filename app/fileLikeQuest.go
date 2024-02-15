package app

import (
	"changeme/models"
	db "changeme/models/fileLike"
	"errors"
)

func (a *App) LsRequestOfCollection(collectionId int64) []db.FileLike {
	var files []db.FileLike
	if collectionId == 0 {
		return nil
	}
	if engine, err := models.GetSqLiteEngine(); err == nil {
		engine.Find(&files, &db.FileLike{FolderId: collectionId, Type: db.REQUEST})
		return files
	} else {
		return nil
	}
}

func (a *App) RenameFileLikeRequest(name string, id int64) error {
	if id == 0 {
		return errors.New("id is not apply")
	} else {
		err := models.BaseRename(name, id, &db.FileLike{})
		return err
	}
}

func (a *App) DelFileLikeRecord(id int64) error {
	if id == 0 {
		return errors.New("id is not apply")
	} else {
		err := models.BasePhyDel(id, &db.FileLike{})
		return err
	}
}

func (a *App) AddRequestToCollection(collectionId int64, name string) *db.FileLike {
	if collectionId == 0 {
		return nil
	}
	if engine, err := models.GetSqLiteEngine(); err == nil {

		var file = &db.FileLike{
			FolderId: collectionId,
			Name:     name,
			Type:     db.REQUEST,
		}
		engine.Insert(file)

		return file

	} else {
		return nil
	}
}
