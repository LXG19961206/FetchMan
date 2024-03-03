package config

type AppBaseConfig struct {
	BaseWorkDir       string
	FileServerPort    int
	RequestServerPort int
	RequestBaseUrl    string
	DbFilePath        string
	CacheFilePath     string
	DbFileName        string
	LogFilePath       string
}

type CconfigExportForClient struct {
	RequestServerPort int
	RequestBaseUrl    string
}

var AppConfig = &AppBaseConfig{}
var AppConfigForClient = &CconfigExportForClient{}

func init() {
	AppConfig.useConfigDefault()
	AppConfigForClient.useClientConfigDefault()
}

func (receiver *AppBaseConfig) useConfigDefault() {
	receiver.BaseWorkDir = "/FetchMan"
	receiver.FileServerPort = 30399
	receiver.RequestServerPort = 10240
	receiver.RequestBaseUrl = "/request"
	receiver.CacheFilePath = "/cache"
	receiver.DbFileName = ".fetchmanV0.1.db"
	receiver.LogFilePath = "/log"
	receiver.DbFilePath = "/db"
}

func (receiver *CconfigExportForClient) useClientConfigDefault() {
	receiver.RequestBaseUrl = AppConfig.RequestBaseUrl
	receiver.RequestServerPort = AppConfig.RequestServerPort
}
