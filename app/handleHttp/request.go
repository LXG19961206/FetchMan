package handlehttp

import (
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
		}()

		var bytes, _ = io.ReadAll(resp.Body)
		CopyHeaders(originRespWriter, resp.Header)
		originRespWriter.Write(bytes)
		return resp
	} else {
		fmt.Printf("err: %v\n", err)
		originRespWriter.Write([]byte("hello world"))
		return nil
	}

}
