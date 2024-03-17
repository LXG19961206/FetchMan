package handlehttp

import (
	"bytes"
	req "changeme/models/request"
	"net/http"
	"strconv"
	"strings"

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

/*
	   主要是存的时候，用的是变量替换之前的，方便用户再次进入时，还能看到之前用了什么变量
		 当然在真正发请求的时候，用的是变量替换之后的数据
*/
func GetRealReqFromHeaders(r *http.Request, bodyBuffer bytes.Buffer) (*http.Request, *req.RequestRecord, error) {

	const YES = "1"

	var envMap = GetEnvVarsMap()

	var (
		headers    = r.Header
		url        = headers.Get(FAKE_URL)
		method     = headers.Get(FAKE_METHOD)
		id, _      = strconv.Atoi(headers.Get(INSTANCE_ID))
		IsBinary   = headers.Get(IS_BINARY) == YES
		IsFormData = headers.Get(IS_FORMDATA) == YES
		body       = GenerateRealBody(headers, bodyBuffer, IsFormData, IsBinary, envMap)
	)

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
		recordHeaders[key] = strings.Join(value, ",")
	}

	record.IsBinary = IsBinary
	record.IsFormData = IsFormData
	record.Body = bodyBuffer.String()
	record.Method = method
	record.Url = url
	record.Id = int64(id)
	record.Headers = recordHeaders

	var realUrl = ReplaceVarWithItsRealValue(url, envMap)

	if newReq, err := http.NewRequest(method, realUrl, body); err == nil {
		newReq.Header = CreateRealValueHeaders(headers, envMap)
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

func CreateRealValueHeaders(header http.Header, envMap map[string]string) http.Header {
	var realHeader = map[string][]string{}
	for key, value := range header {
		var partly = lo.Map[string](value, func(partValue string, idx int) string {
			return ReplaceVarWithItsRealValue(partValue, envMap)
		})
		realHeader[key] = partly
	}
	return realHeader
}
