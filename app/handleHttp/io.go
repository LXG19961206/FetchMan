package handlehttp

import (
	"bytes"
	dbUtil "changeme/models"
	reqTable "changeme/models/request"
	"fmt"
	"net/http"
	"strings"
)

func SaveRequest(
	req *http.Request,
	isBinary bool,
	isFormData bool,
	originBody bytes.Buffer,
) {

	var headers = map[string]string{}

	for key, val := range req.Header {
		headers[key] = strings.Join(val, ",")
	}

	var record = &reqTable.RequestRecord{
		Url:         req.URL.String(),
		Method:      req.Method,
		IsBinary:    isBinary,
		IsFormData:  isFormData,
		Headers:     headers,
		ContentType: req.Header.Get("Content-Type"),
		Body:        originBody.String(),
		OriginUrl:   req.URL.String(),
	}

	if engine, err := dbUtil.GetSqLiteEngine(); engine != nil {
		var _, insertErr = engine.Insert(record)
		fmt.Printf("insertErr: %v\n", insertErr)
	} else {
		fmt.Printf("err: %v\n", err)
	}

}

func SaveResp(req *http.Response) {
}
