package handlehttp

import (
	"bytes"
	req "changeme/models/request"
	"net/http"
	"strconv"

	"github.com/samber/lo"
)

type SpecialHeaders struct {
	Method string `json:"fetchman_method"`
	Url    string `json:"fetchman_url"`
	Times  string `json:"fetchman_times"`
}

const (
	PREFIX      = "fetchman"
	FAKE_METHOD = PREFIX + "Method"
	FAKE_URL    = PREFIX + "Url"
	FAKE_TIMES  = PREFIX + "Times"
	INSTANCE_ID = PREFIX + "InstanceId"
)

const (
	IS_BINARY   = PREFIX + "Bainy"
	IS_FORMDATA = PREFIX + "FormDate"
)

func GetRealReqFromHeaders(r *http.Request, bodyBuffer bytes.Buffer) (*http.Request, *req.RequestRecord, error) {

	const YES = "1"

	var (
		headers    = r.Header
		url        = headers.Get(FAKE_URL)
		method     = headers.Get(FAKE_METHOD)
		id, _      = strconv.Atoi(headers.Get(INSTANCE_ID))
		IsBinary   = headers.Get(IS_BINARY) == YES
		IsFormData = headers.Get(IS_FORMDATA) == YES
	)

	var body = GenerateRealBody(headers, bodyBuffer, IsFormData, IsBinary)

	var toDels = []string{
		FAKE_URL,
		FAKE_METHOD,
		FAKE_TIMES,
		IS_BINARY,
		IS_FORMDATA,
		INSTANCE_ID,
	}

	lo.ForEach[string](toDels, func(key string, _ int) {
		headers.Del(key)
	})

	var record = &req.RequestRecord{}
	var recordHeaders = map[string]string{}

	for key, value := range headers {
		recordHeaders[key] = value[0]
	}

	record.IsBinary = IsBinary
	record.IsFormData = IsFormData
	record.Body = bodyBuffer.String()
	record.Method = method
	record.Url = url
	record.Id = int64(id)
	record.Headers = recordHeaders

	if newReq, err := http.NewRequest(method, url, body); err == nil {
		newReq.Header = headers
		return newReq, record, err
	} else {
		return nil, record, err
	}

}

func CopyHeaders(originRespWriter http.ResponseWriter, headers http.Header) {

	if len(headers) == 0 {
		return
	}

	for key, value := range headers {
		originRespWriter.Header().Set(key, value[0])
	}

}
