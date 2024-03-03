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

func (a *App) GetFileUrl() string {
	return "http://localhost" + ":" + strconv.Itoa(config.AppConfigForClient.FileServerPort) + config.AppConfigForClient.RequestFileUrl
}

func (a *App) GetSpecialFields() *SpecialReqHeaderFields {
	return &SpecialReqHeaderFields{
		Method:     handleHttp.FAKE_METHOD,
		Url:        handleHttp.FAKE_URL,
		Times:      handleHttp.FAKE_TIMES,
		IsBinary:   handleHttp.IS_BINARY,
		IsFormData: handleHttp.IS_FORMDATA,
	}
}

func (a *App) GetFilePathPlaceholder() string {
	return config.AppConfigForClient.FilePlaceholderPath
}

type SpecialReqHeaderFields struct {
	Method     string
	Url        string
	Times      string
	IsBinary   string
	IsFormData string
}
