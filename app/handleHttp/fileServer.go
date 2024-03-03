package handlehttp

import (
	"changeme/config"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

var mux = http.NewServeMux()

var fileHandleFunc = func(w http.ResponseWriter, r *http.Request) {
	var restPath = strings.Join(strings.Split(r.URL.String(), config.AppConfig.RequestFileUrl)[1:], "")
	var decodedRestPath, err = url.QueryUnescape(restPath)
	fmt.Printf("decodedRestPath: %v\n", decodedRestPath)
	if err == nil {
		http.ServeFile(w, r, decodedRestPath)
	}
}

func StartFileServer() {
	var port = fmt.Sprintf(":%d", config.AppConfig.FileServerPort)
	mux.HandleFunc(config.AppConfig.RequestFileUrl+"/", fileHandleFunc)
	go http.ListenAndServe(port, mux)
}
