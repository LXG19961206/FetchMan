package request

import (
	"changeme/app"
	"changeme/config"
	"changeme/model"
	"changeme/service/db"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
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

func SaveBodyAsFile(body io.Reader) (fileid int, filePath string) {

	var (
		fileName     = time.Now().UnixMilli()
		fullPath     = fmt.Sprintf("%s/%s", app.BaseConfig.BodyDir, fileName)
		btyeVal, err = ioutil.ReadAll(body)
	)

	if err != nil {

		return 0, ""

	}

	os.WriteFile(fullPath, btyeVal, os.ModePerm)

	var file = &model.Body{
		FilePath:   filePath,
		CreateTime: time.Now().String(),
		SaveAsText: false,
	}

	db.InsertColByTemplate(config.Table_body, file)

}
