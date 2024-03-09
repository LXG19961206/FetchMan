package app

import (
	handleHttp "changeme/app/handleHttp"
	dbUtil "changeme/models"
	fileLike "changeme/models/fileLike"
	req "changeme/models/request"
	"net/http"
)

// func (a *App) SimpleRequest(arg *model.AppRequest) interface{} {
// 	return request.QuickRequest(arg)
// }

// func (a *App) AddRequest(arg *model.AppRequest) interface{} {
// 	return request.AddReqRecord(arg)
// }

// func (a *App) GetRecordById(id int) map[string]interface{} {
// 	var req = db.SelectFieldByMap(config.Table_request_record, []string{"*"}, map[string]interface{}{"id": id})
// 	return req[0]
// }

func (a *App) GetRequestById(id int64) *req.RequestRecord {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &req.RequestRecord{}
		engine.ID(id).Get(record)
		return record
	} else {
		return nil
	}
}

func (a *App) CopyRequest(id int64) *req.RequestRecord {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &req.RequestRecord{}
		engine.ID(id).Get(record)
		record.Id = 0
		engine.Insert(record)
		return record
	}
	return nil
}

func (a *App) UpdateRequestInfo(record *req.RequestRecord) {
	handleHttp.UpdateRequestInfo(record)
}

func CreateBlankRequest(isRef bool) (*req.RequestRecord, error) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &req.RequestRecord{
			Method:       http.MethodGet,
			IsReferenced: isRef,
		}
		var _, InsertErr = engine.Insert(record)
		return record, InsertErr
	} else {
		return nil, err
	}
}

func (a *App) CreateBlankRequest() (*req.RequestRecord, error) {
	return CreateBlankRequest(false)
}

func (a *App) GetFolderIdByReqId(id int64) int64 {
	var file = &fileLike.FileLike{
		RequestId: id,
	}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Get(file)
		return file.FolderId
	}
	return 0
}
