package app

import (
	"changeme/config"
	"changeme/launch"
	"changeme/model"
	"context"
)

var Application = &App{}

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
