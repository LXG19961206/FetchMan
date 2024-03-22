package handlehttp

import (
	"changeme/config"
	dbUtil "changeme/models"
	reqTable "changeme/models/request"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

func CreateRealReqAndForward(w http.ResponseWriter, r *http.Request) {

	var idFromPath = strings.TrimPrefix(r.URL.String(), config.AppConfig.RequestBaseUrl+"/")

	var intId, _ = strconv.Atoi(idFromPath)

	var record = &reqTable.RequestRecord{}

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.ID(int64(intId)).Get(record)
	}

	if req, err := CreateRealReqInstance(*record); err == nil {
		/*
			  帮客户端去发送这个新的请求，并将结果转发给客户端
				我需要转发并且可能需要把结果记录入库，需要知晓这个请求的结果
				因此不能直接使用 Proxy（代理），这个转发的过程不是透明的
		*/
		var resp = ForwardRequest(w, req)
		/*
			  如果需要同步请求信息到数据库或者其他额外的 io 操作
				为这个行为开启一个协程，无需阻塞
				存储的是客户端发过来的描述请求的数据，而不是真实的请求信息
				这样方便客户端后续的反显
				如果存储一个真实请求，后续可能还需要把复杂的请求体再次解析回去
		*/
		record.Headers = TransBackHeaders(req.Header, record.Headers)
		go UpdateRequestInfo(record)
		/*
			在某些时候，需要将响应的信息也存起来
		*/
		go SaveResp(resp)

	} else {
		fmt.Printf("err: %v\n", err)
	}

}

func HandleFunc(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("(\"hadas\"): %v\n", ("hadas"))
	HanleClientCors(w, r)
	if r.Method == http.MethodOptions {
		fmt.Printf("(\"option\"): %v\n", ("option"))
		return
	} else if r.Method == http.MethodGet {
		CreateRealReqAndForward(w, r)
	} else {
		fmt.Print("eaweaweljae")
	}
}

func StartServer() {
	go func() {
		/*

			1.客户端只负责描述请求的样子，而不去实际发送请求。
				因为 浏览器以及 webview存在同一域名下的最大请求并发队列，
				如果某些请求的响应时间过长，达到队列的长度后，后续的请求将会一直pending住，直到请求队列有空闲时，才会去处理这些请求。
				这种行为将会使 后续的「性能测试」功能很难去做。

			2.主流浏览器无法构建带 body 的 get 请求(xhr会直接静默失效，fetch会报错)
				但是实际上不少开发者设计出了这样的 api 接口（在这里不去讨论这种设计的合规好坏与否），
				单纯为了支持这种场景，我们需要通过一个代理服务来转发请求，并且客户端的所有请求都以 post 形式发送，然后真正的请求行放在了请求头里

		*/
		var port = fmt.Sprintf(":%d", config.AppConfig.RequestServerPort)
		http.HandleFunc(config.AppConfig.RequestBaseUrl+"/", HandleFunc)
		http.ListenAndServe(port, nil)
	}()

}
