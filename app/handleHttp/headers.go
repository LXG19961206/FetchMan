package handlehttp

import (
	"bytes"
	"fmt"
	"net/http"
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
)

const (
	IS_BINARY   = PREFIX + "Bainy"
	IS_FORMDATA = PREFIX + "FormDate"
)

func GetRealReqFromHeaders(r *http.Request, bodyBuffer bytes.Buffer) (*http.Request, bool, bool, error) {

	const YES = "1"

	var (
		headers    = r.Header
		url        = headers.Get(FAKE_URL)
		method     = headers.Get(FAKE_METHOD)
		IsBinary   = headers.Get(IS_BINARY) == YES
		IsFormData = headers.Get(IS_FORMDATA) == YES
	)

	var body = GenerateRealBody(headers, bodyBuffer, IsFormData, IsBinary)

	fmt.Printf("headers.Get(\"Content-Type\"): %v\n", headers.Get("Content-Type"))

	headers.Del(FAKE_URL)
	headers.Del(FAKE_METHOD)
	headers.Del(FAKE_TIMES)
	headers.Del(IS_BINARY)
	headers.Del(IS_FORMDATA)

	if newReq, err := http.NewRequest(method, url, body); err == nil {
		newReq.Header = headers
		return newReq, IsBinary, IsFormData, err
	} else {
		return nil, IsBinary, IsFormData, err
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
