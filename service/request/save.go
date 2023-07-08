package request

import (
	"bytes"
	"changeme/config"
	"changeme/launch"
	"changeme/model"
	"changeme/service/db"
	fileService "changeme/service/file"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func GenerateReqRecord(req *http.Request, reqInfo *model.AppRequest) *model.RequestRecord {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(reqInfo.Headers)
		buf                             = new(bytes.Buffer)
		_, _                            = buf.ReadFrom(req.Body)
		bodyId, _                       = SaveBodyAsFile(buf, req.Header.Get(ContentType))
	)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	return &model.RequestRecord{
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
}

func UpdateReqRecord(req *http.Request, reqInfo *model.AppRequest) error {

	var reqRec = GenerateReqRecord(req, reqInfo)

	return db.UpadteColById(config.Table_request_record, *reqRec, reqInfo.Id)

}

func SyncReqRecordToDb(req *http.Request, reqInfo *model.AppRequest) (int, string) {

	var reqRec = GenerateReqRecord(req, reqInfo)

	id, err := db.InsertColByTemplate(config.Table_request_record, *reqRec)

	return id, err

}

func SaveBodyAsFile(bodyBuf *bytes.Buffer, cttType string) (int, string) {

	var (
		text        string
		fileName    = fmt.Sprintf("%d", time.Now().UnixMilli())
		saveAsText  = bodyBuf.Len() < config.BodyFileMinByteSize && !fileService.IsFileBinary(bodyBuf)
		baseDirPath = config.HomeDir + config.RootDirName
		path        = fmt.Sprintf("%s/%s", config.RecordBodyDirName, fileName)
		fullPath    = baseDirPath + path
	)

	if saveAsText {

		text = bodyBuf.String()

	} else {

		bodyBytes := bodyBuf.Bytes()

		var contentType = func() string {
			if len(cttType) > 0 {
				return cttType
			} else {
				return http.DetectContentType(bodyBytes)
			}
		}()

		extName := fileService.GetExtName(contentType)

		fullPath = fmt.Sprintf("%s%s", fullPath, extName)

		path = fmt.Sprintf("%s%s", path, extName)

		var file, fileErr = os.OpenFile(fullPath, os.O_CREATE|os.O_RDWR, 0644)

		defer func() {
			_ = file.Close()
		}()

		if fileErr != nil {
			launch.AppLogger.Error().Msg(fileErr.Error())
		}

		_, writeErr := file.Write(bodyBytes)

		if writeErr != nil {
			launch.AppLogger.Error().Msg(writeErr.Error())
		}

	}

	var finalBody = &model.Body{
		Text:       text,
		FilePath:   fullPath,
		CreateTime: time.Now().String(),
		SaveAsText: saveAsText,
	}

	var (
		id, _ = db.InsertColByTemplate(config.Table_body, *finalBody)
	)

	return id, path

}

func SyncRespRecordToDb(
	resp *model.AppResp,
	bodyBuf *bytes.Buffer,
	reqId int,
	req http.Request,
	cttType string,
) (int, string) {

	var (
		headersStr, stringifyHeadersErr = json.Marshal(resp.Headers)
		bodyId, bodyPath                = SaveBodyAsFile(bodyBuf, cttType)
	)

	if stringifyHeadersErr != nil {
		headersStr = []byte("")
	}

	var respRec = &model.RespRecord{
		Url:         req.URL.String(),
		Method:      req.Method,
		Status:      resp.Status,
		StatusCode:  resp.StatusCode,
		ContentType: cttType,
		ReqId:       reqId,
		BodyId:      bodyId,
		Headers:     string(headersStr),
		CreateTime:  fmt.Sprintf("%d", time.Now().UnixMilli()),
		CostTime:    0,
	}

	id, _ := db.InsertColByTemplate(config.Table_resp_record, *respRec)

	return id, bodyPath
}

func GetBodyBuffer(body io.Reader) *bytes.Buffer {

	var buf = new(bytes.Buffer)

	_, err := buf.ReadFrom(body)

	if err != nil {
		launch.AppLogger.Error().Msg(err.Error())
	}

	return buf

}
