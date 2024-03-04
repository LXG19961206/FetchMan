package handlehttp

import (
	"changeme/config"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

var mux = http.NewServeMux()

/*
  主要是为了客户端资源的反显
	由于是借助 go 进程触发系统原生 upload 功能
	完成上传后，客户端能拿到 文件 在 设备上的物理路径
	但是 file:// 协议在大多数 webView 上和浏览器的使用存在限制
	因此创建了这个服务，给定一物理路径，返给客户端资源
*/

var fileHandleFunc = func(w http.ResponseWriter, r *http.Request) {
	var restPath = strings.Join(strings.Split(r.URL.String(), config.AppConfig.RequestFileUrl)[1:], "")
	var decodedRestPath, err = url.QueryUnescape(restPath)
	if err == nil {
		http.ServeFile(w, r, decodedRestPath)
	}
}

func StartFileServer() {
	var port = fmt.Sprintf(":%d", config.AppConfig.FileServerPort)
	mux.HandleFunc(config.AppConfig.RequestFileUrl+"/", fileHandleFunc)
	go http.ListenAndServe(port, mux)
}
