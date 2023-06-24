package launch

import (
	"changeme/config"
	"changeme/model"
	"changeme/service/db"
	_ "github.com/mattn/go-sqlite3"
)

var TablesMap = map[string]interface{}{
	"request_record": model.RequestRecord{},
	"resp_record":    model.RespRecord{},
	"env":            model.Env{},
	"vars":           model.Vars{},
	"body":           model.Body{},
}

func InitDb(conf model.AppBaseConfig) {

	database := db.OpenOrCreateDb(config.DbFileName, conf.DbDir)

	for name, tableStruct := range TablesMap {
		db.CheckOrCreateTable(database, name, tableStruct)
	}

	AppLogger.Info().Msg("db init done")

}
