package app

import (
	"changeme/launch"
	"changeme/model"
	"context"
)

// App struct
type App struct {
	ctx context.Context
}

func (a *App) Startup(ctx context.Context) {

	a.ctx = ctx

	var baseConfig = &model.AppBaseConfig{}

	baseConfig.InitOrUpdateConfig()

	launch.HandleFolder(*baseConfig)

	var logFile = launch.InitLog(*baseConfig)

	defer func() {
		_ = logFile.Close()
	}()

	launch.InitDb(*baseConfig)

}
