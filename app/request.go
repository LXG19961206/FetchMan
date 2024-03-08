package app

import (
	dbUtil "changeme/models"
	req "changeme/models/request"
	tabTable "changeme/models/tab"
	"fmt"
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

func (a *App) GetRequestById(id int) *req.RequestRecord {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &req.RequestRecord{}
		engine.ID(id).Get(record)
		return record
	} else {
		return nil
	}
}

func (a *App) UpdateRequestInfo(record *req.RequestRecord) {

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {

		engine.Table(&req.RequestRecord{}).ID(record.Id).AllCols().Update(record)

		var tab = &tabTable.Tab{}

		engine.Where(`request_id = ?`, record.Id).Get(tab)

		fmt.Printf("tab: %v\n", tab)

		tab.Name = record.Url
		tab.Method = record.Method
		engine.ID(tab.Id).Update(tab)
	}

}

func CreateBlankRequest() (*req.RequestRecord, error) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &req.RequestRecord{
			Method: http.MethodGet,
		}
		var _, InsertErr = engine.Insert(record)
		return record, InsertErr
	} else {
		return nil, err
	}
}

func (a *App) CreateBlankRequest() (*req.RequestRecord, error) {
	return CreateBlankRequest()
}
