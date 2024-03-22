package handlehttp

import (
	req "changeme/models/request"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func ForwardRequest(originRespWriter http.ResponseWriter, req *http.Request) *http.Response {
	if req.URL.String() == "" {
		return nil
	}
	var client = &http.Client{}
	if resp, err := client.Do(req); err == nil {
		defer func() {
			client.CloseIdleConnections()
			resp.Body.Close()
			req.Body.Close()
		}()
		var bytes, _ = io.ReadAll(resp.Body)
		CopyHeaders(originRespWriter, resp.Header)
		originRespWriter.Write(bytes)
		return resp
	} else {
		fmt.Printf("err: %v\n", err)
		originRespWriter.Write([]byte(err.Error()))
		originRespWriter.WriteHeader(http.StatusInternalServerError)
		return nil
	}
}

func CreateRealReqInstance(req req.RequestRecord) (*http.Request, error) {

	var envMap = GetEnvVarsMap()
	var originHeaders = TransHeaders(req.Headers)

	var (
		headers = CreateRealValueHeaders(originHeaders, envMap)
		realUrl = ReplaceVarWithItsRealValue(req.Url, envMap)
		method  = req.Method
		body    = GenerateRealBody(headers, req.Body, req.IsBinary, req.IsFormData, envMap)
	)

	// fmt.Printf("headers: %v\n", headers)
	b, _ := json.Marshal(headers)
	fmt.Println(string(b))
	fmt.Printf("realUrl: %v\n", realUrl)
	fmt.Printf("method: %v\n", method)

	if newReq, err := http.NewRequest(method, realUrl, body); err == nil {
		newReq.Header = headers
		return newReq, nil
	} else {
		return nil, err
	}

}
