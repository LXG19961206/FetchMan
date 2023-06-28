package launch

import (
	"changeme/config"
	"changeme/model"
	"changeme/service/db"
	_ "github.com/mattn/go-sqlite3"
)

var TablesMap = map[string]interface{}{
	config.Table_request_record: model.RequestRecord{},
	config.Table_resp_record:    model.RespRecord{},
	config.Table_env:            model.Env{},
	config.Table_vars:           model.Vars{},
	config.Table_body:           model.Body{},
}

func InitDb(conf model.AppBaseConfig) {

	db.OpenOrCreateDb(config.DbFileName, conf.DbDir)

	for name, tableStruct := range TablesMap {
		db.CheckOrCreateTable(name, tableStruct)
	}

}
