package app

import (
	"changeme/config"
	"changeme/model"
	req "changeme/models/request"
	"changeme/service/db"
	"changeme/service/request"
)

func (a *App) SimpleRequest(arg *model.AppRequest) interface{} {

	return request.QuickRequest(arg)

}

func (a *App) AddRequest(arg *model.AppRequest) interface{} {

	return request.AddReqRecord(arg)

}

func (a *App) GetRecordById(id int) map[string]interface{} {

	var req = db.SelectFieldByMap(config.Table_request_record, []string{"*"}, map[string]interface{}{"id": id})

	return req[0]

}

func (a *App) GetRequestById(id int64) req.RequestRecord {
	return req.RequestRecord{}
}
