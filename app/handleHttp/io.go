package handlehttp

import (
	dbUtil "changeme/models"
	req "changeme/models/request"
	tabTable "changeme/models/tab"
	"net/http"
)

func UpdateRequestInfo(record *req.RequestRecord) {

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {

		engine.Table(&req.RequestRecord{}).ID(record.Id).AllCols().Update(record)

		var tab = &tabTable.Tab{}

		engine.Where(`request_id = ?`, record.Id).Get(tab)

		if record.Url != "" {
			if len(record.Url) > 20 {
				tab.Url = record.Url[0:20]
			} else {
				tab.Url = record.Url
			}
		}
		tab.Method = record.Method
		engine.ID(tab.Id).Update(tab)
	}

}

func SaveResp(req *http.Response) {
}
