package request

import (
	"changeme/config"
	"changeme/model"
	"changeme/service/db"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/gommon/log"
)

func SyncReqRecordToDb(req *http.Request, reqInfo *model.AppRequest) {

	var headersStr, stringifyHeadersErr = json.Marshal(reqInfo.Headers)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	var reqRec = &model.RequestRecord{
		Url:           req.URL.String(),
		Method:        req.Method,
		Headers:       string(headersStr),
		BodyId:        "",
		OriginUrl:     req.URL.String(),
		WorkplaceFlag: "1",
		EnvId:         0,
		ContentType:   req.Header.Get(ContentType),
		Name:          req.URL.String(),
		CreateTime:    fmt.Sprintf("%d", time.Now().UnixMilli()),
	}

	db.InsertColByTemplate(config.Table_request_record, *reqRec)

	var sql = fmt.Sprintf("select * from %s", config.Table_request_record)

	var col, err = db.AppDb.Query(sql)

	defer func() {
		_ = col.Close()
	}()

	if err != nil {
		return
	}

	for col.Next() {

		var content string

		col.Scan(&content)

		log.Info(content)

	}

}
