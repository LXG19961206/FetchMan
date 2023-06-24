package app

import (
	"changeme/model"
	"changeme/service/request"
)

func (a *App) SimpleRequest(arg *model.AppRequest) interface{} {

	return request.QuickRequest(arg)

}
