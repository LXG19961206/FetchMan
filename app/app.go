package app

import (
	"changeme/config"
	"changeme/launch"
	"changeme/model"
	"context"
)

// App struct
type App struct {
	ctx context.Context
}

func (app *App) Startup(ctx context.Context) {

	app.ctx = ctx

	var baseConfig = &model.AppBaseConfig{}

	baseConfig.InitOrUpdateConfig()

	launch.HandleFolder(*baseConfig)

	launch.InitLog(*baseConfig)

	launch.InitDb(*baseConfig)

	launch.StartFileServer(config.HomeDir + config.RootDirName)

}

func (a *App) GetPort() int {
	return config.DefaultFileServerPort
}
