package app

import (
	dbUtil "changeme/models"
	fileLikeTable "changeme/models/fileLike"
	reqTable "changeme/models/request"
	tabTable "changeme/models/tab"
	"errors"
	"fmt"
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
		if newReq, reqCrtErr := CreateBlankRequest(); reqCrtErr == nil {
			var file = &fileLikeTable.FileLike{
				FolderId:  collectionId,
				Name:      name,
				Tag:       newReq.Method,
				Type:      fileLikeTable.REQUEST,
				RequestId: newReq.Id,
			}
			engine.Insert(file)
			return file
		} else {
			return nil
		}
	} else {
		return nil
	}
}

func BatchPhyDeleteFileLikeRequest(folderIds []int64) {

	fmt.Printf("folderIds: %v\n", folderIds)

	if engine, _ := dbUtil.GetSqLiteEngine(); engine != nil {

		var toDelRecords []fileLikeTable.FileLike
		var reqIds = []int64{}
		var toDel = []int64{}

		engine.In("folder_id", folderIds).Select("request_id, id").Find(&toDelRecords)

		fmt.Printf("toDelRecords: %v\n", toDelRecords)

		for _, record := range toDelRecords {
			reqIds = append(reqIds, record.RequestId)
			toDel = append(toDel, record.Id)
		}

		engine.In("id", toDel).Delete(&fileLikeTable.FileLike{})
		engine.In("id", reqIds).Delete(&reqTable.RequestRecord{})
		engine.In("request_id", reqIds).Delete(&tabTable.Tab{})

	}
}
