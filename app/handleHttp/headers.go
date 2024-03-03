package handlehttp

import (
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

func GetRealReqFromHeaders(r *http.Request) (*http.Request, error) {
	var (
		headers = r.Header
		url     = headers.Get(FAKE_URL)
		method  = headers.Get(FAKE_METHOD)
	)
	headers.Del(FAKE_URL)
	headers.Del(FAKE_METHOD)
	headers.Del(FAKE_TIMES)
	if newReq, err := http.NewRequest(method, url, r.Body); err == nil {
		newReq.Header = headers
		return newReq, err
	} else {
		return nil, err
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
