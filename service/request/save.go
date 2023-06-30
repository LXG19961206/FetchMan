package request

import (
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

func SyncReqRecordToDb(req *http.Request, reqInfo *model.AppRequest) (int, string) {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(reqInfo.Headers)
		bodyId, _                       = SaveBodyAsFile(req.Body)
	)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	var reqRec = &model.RequestRecord{
		Url:           req.URL.String(),
		BodyId:        bodyId,
		Method:        req.Method,
		Headers:       string(headersStr),
		OriginUrl:     req.URL.String(),
		WorkplaceFlag: "1",
		EnvId:         0,
		ContentType:   req.Header.Get(ContentType),
		Name:          req.URL.String(),
		CreateTime:    fmt.Sprintf("%d", time.Now().UnixMilli()),
	}

	id, err := db.InsertColByTemplate(config.Table_request_record, *reqRec)

	return id, err
}

func SaveBodyAsFile(body io.Reader) (fileid int, filePath string) {

	var (
		fileName     = fmt.Sprintf("%d", time.Now().UnixMilli())
		fullPath     = fmt.Sprintf("%s/%s", config.HomeDir+config.RecordBodyDirName, fileName)
		btyeVal, err = ioutil.ReadAll(body)
	)

	if err != nil {
		return 0, ""
	}

	var file, fileErr = os.OpenFile(fullPath, os.O_CREATE|os.O_RDWR, 0644)

	if fileErr != nil {

	}

	file.Write(btyeVal)

	var finalBody = &model.Body{
		FilePath:   filePath,
		CreateTime: time.Now().String(),
		SaveAsText: false,
	}

	var (
		id, _ = db.InsertColByTemplate(config.Table_body, *finalBody)
	)

	return id, filePath

}

func SyncRespRecordToDb(resp *model.AppResp, originResp *http.Response, reqId int, req http.Request) (int, string) {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(resp.Headers)
		bodyId, _                       = SaveBodyAsFile(originResp.Body)
	)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	var respRec = &model.RespRecord{
		Url:         req.URL.String(),
		Method:      req.Method,
		Status:      resp.Status,
		StatusCode:  resp.StatusCode,
		ContentType: originResp.Header.Get(ContentType),
		ReqId:       reqId,
		BodyId:      bodyId,
		Headers:     string(headersStr),
		CreateTime:  fmt.Sprintf("%d", time.Now().UnixMilli()),
		CostTime:    0,
	}

	log.Info(respRec)

	id, err := db.InsertColByTemplate(config.Table_resp_record, *respRec)

	return id, err
}
