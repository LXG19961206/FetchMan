package app

import (
	handleHttp "changeme/app/handleHttp"
	"changeme/config"
	"strconv"
)

func (a *App) GetPort() int {
	return 30399
	// return config.DefaultFileServerPort
}

func (a *App) GetBaseUrl() string {
	return "http://localhost" + ":" + strconv.Itoa(config.AppConfigForClient.RequestServerPort) + config.AppConfigForClient.RequestBaseUrl
}

func (a *App) GetSpecialFields() *SpecialReqLineFieldForClient {
	return &SpecialReqLineFieldForClient{
		Method: handleHttp.FAKE_METHOD,
		Url:    handleHttp.FAKE_URL,
		Times:  handleHttp.FAKE_TIMES,
	}
}

type SpecialReqLineFieldForClient struct {
	Method string
	Url    string
	Times  string
}
