package request

import (
	"changeme/config"
	"changeme/launch"
	"changeme/model"
	"changeme/service/db"
	"encoding/json"
	"fmt"
	"github.com/labstack/gommon/log"
	"io"
	"net/http"
	"os"
	"time"
)

func SyncReqRecordToDb(req *http.Request, reqInfo *model.AppRequest) (int, string) {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(reqInfo.Headers)
		reqBody, bodyErr                = io.ReadAll(req.Body)
		bodyId, _                       = SaveBodyAsFile(reqBody)
	)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	log.Info(reqBody)

	if bodyErr != nil {
		launch.AppLogger.Info().Msg(bodyErr.Error())
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

func SaveBodyAsFile(bodyVal []byte) (int, string) {

	var (
		fileName = fmt.Sprintf("%d", time.Now().UnixMilli())
		fullPath = fmt.Sprintf("%s/%s", config.HomeDir+config.RootDirName+config.RecordBodyDirName, fileName)
	)

	log.Info(bodyVal)

	if len(bodyVal) == 0 {
		return 0, ""
	}

	var file, fileErr = os.OpenFile(fullPath, os.O_CREATE|os.O_RDWR, 0644)

	defer func() {
		_ = file.Close()
	}()

	if fileErr != nil {
		launch.AppLogger.Error().Msg(fileErr.Error())
	}

	_, writeErr := file.WriteString(string(bodyVal))

	if writeErr != nil {
		launch.AppLogger.Error().Msg(writeErr.Error())
	}

	var finalBody = &model.Body{
		FilePath:   fullPath,
		CreateTime: time.Now().String(),
		SaveAsText: false,
	}

	var (
		id, _ = db.InsertColByTemplate(config.Table_body, *finalBody)
	)

	return id, fullPath

}

func SyncRespRecordToDb(resp *model.AppResp, originResp *http.Response, reqId int, req http.Request) (int, string) {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(resp.Headers)
		respBody, bodyErr               = io.ReadAll(originResp.Body)
		bodyId, _                       = SaveBodyAsFile(respBody)
	)

	log.Info(respBody)

	if bodyErr != nil {
		launch.AppLogger.Error().Msg(bodyErr.Error())
	}

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

	id, err := db.InsertColByTemplate(config.Table_resp_record, *respRec)

	return id, err
}
