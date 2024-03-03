package handlehttp

import (
	"changeme/config"
	"fmt"
	"net/http"

	"github.com/labstack/gommon/log"
)

func init() {

	go func() {
		/*
			  实现的思路是客户端无论真正什么请求的 url、method 都固定向这个 url:port 发送 post 请求
				真实的请求行放在请求头的几个约定好的字段中
				服务端根据这些字段来还原客户端原本的请求, 然后转发结果给客户端

				这么做的初衷主要有几点：

				1.客户端只负责描述请求的样子，而不去实际发送请求。
					因为 浏览器以及 webview存在同一域名下的最大请求并发队列，
					如果某些请求的响应时间过长，达到队列的长度后，后续的请求将会一直pending住，直到请求队列有空闲时，才会去处理这些请求。
					这种行为将会使 后续的「性能测试」功能很难去做。

				2.主流浏览器无法构建带 body 的 get 请求(xhr会直接静默失效，fetch会报错)
					但是实际上不少开发者设计出了这样的 api 接口（在这里不去讨论这种设计的合规好坏与否），
					单纯为了支持这种场景，我们需要通过一个代理服务来转发请求，并且客户端的所有请求都以 post 形式发送，然后真正的请求行放在了请求头里

		*/
		var port = fmt.Sprintf(":%d", config.AppConfig.RequestServerPort)
		http.HandleFunc(config.AppConfig.RequestBaseUrl, HandleFunc)
		http.ListenAndServe(port, nil)
	}()
}

var HandleFunc = func(w http.ResponseWriter, r *http.Request) {

	/*
		  因为请求是使用 webview(大部分api和逻辑和请求蓝旗一致)
			首先处理客户端发送请求的跨域问题
	*/
	var _, isOption = HanleClientCors(w, r)

	if isOption {
		return
	}
	/*
	  从请求头中拿到真实的请求首行，然后拼成一个新的请求
	*/
	if req, err := GetRealReqFromHeaders(r); err == nil {
		/*
			  如果需要同步请求信息到数据库或者其他额外的 io 操作
				为这个行为开启一个协程，无需阻塞
		*/
		go SaveRequest(req)
		/*
		  帮客户端去发送这个新的请求，并将结果转发给客户端
		*/
		var resp = ForwardRequest(w, req)
		/*
			  如果需要同步响应信息到数据库或者其他额外的 io 操作
				为这个行为开启一个协程，无需阻塞
		*/
		go SaveResp(resp)

	} else {
		w.Write([]byte(err.Error()))
		log.Error(err)
	}

}