package request

import (
	"bytes"
	"changeme/launch"
	"changeme/model"
	"net/http"
	"strings"

	"github.com/labstack/gommon/log"
)

func CreateReqInstance(reqInfo *model.AppRequest) (*http.Request, error) {

	var (
		url               = reqInfo.Url
		method            = strings.ToUpper(reqInfo.Method)
		headers           = reqInfo.Headers
		body, contentType = BodyHandler(reqInfo.Body)
		req, err          = http.NewRequest(method, url, body)
	)

	if err != nil {
		return nil, err
	}

	for _, value := range headers {
		if reqInfo.Body.Type == FormData && value[0] == ContentType {
			continue
		}
		if itemName, itemVal := value[0], value[1]; len(itemName) > 0 && len(itemVal) > 0 {
			req.Header.Add(itemName, itemVal)
		}
	}

	if len(contentType) > 0 {
		req.Header.Add(ContentType, contentType)
	}

	return req, nil

}

func AddReqRecord(reqInfo *model.AppRequest) int {

	var req, err = CreateReqInstance(reqInfo)

	if err != nil {
		launch.AppLogger.Error().Msg(err.Error())
	} else {
		reqId, _ := SyncReqRecordToDb(req, reqInfo)
		return reqId
	}

	return 0
}

func QuickRequest(reqInfo *model.AppRequest) *model.AppResp {

	var req, err = CreateReqInstance(reqInfo)

	if err != nil {
		log.Info(err)
		return &model.AppResp{
			StatusCode: 0,
			Status:     err.Error(),
		}
	}

	var (
		cli           = &http.Client{}
		resp, respErr = cli.Do(req)
	)

	if respErr != nil {
		return &model.AppResp{
			StatusCode: 0,
			Status:     respErr.Error(),
		}
	}

	if reqInfo.Id == 0 {

		reqId, _ := SyncReqRecordToDb(req, reqInfo)

		finalResp := handleResp(*resp, *req, reqId)

		return finalResp

	} else {

		if err := UpdateReqRecord(req, reqInfo); err != nil {
			launch.AppLogger.Error().Msg(err.Error())
		}

		finalResp := handleResp(*resp, *req, reqInfo.Id)

		return finalResp

	}

}

func handleResp(resp http.Response, req http.Request, reqId int) *model.AppResp {

	var (
		status     = resp.Status
		headers    = getHeadersList(resp.Header)
		statusCode = resp.StatusCode
		buf        = new(bytes.Buffer)
	)

	defer func() {
		//_ = resp.Body.Close()
	}()

	_, _ = buf.ReadFrom(resp.Body)

	var finalReqHeaders [][2]string

	for name, value := range req.Header {
		finalReqHeaders = append(finalReqHeaders, [2]string{name, strings.Join(value, ",")})
	}

	var afterHandle = &model.AppResp{
		Status:     status,
		StatusCode: statusCode,
		Headers:    headers,
		Body:       buf.String(),
		ReqHeaders: finalReqHeaders,
		Proto:      resp.Proto,
	}

	_, bodyPath := SyncRespRecordToDb(afterHandle, buf, reqId, req, resp.Header.Get(ContentType))

	afterHandle.BodyPath = bodyPath

	return afterHandle

}

func getHeadersList(httpHeader http.Header) [][2]string {

	var headers [][2]string

	for k, v := range httpHeader {

		headers = append(headers, [2]string{k, strings.Join(v, ",")})

	}

	return headers

}
