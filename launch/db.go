package launch

import (
	"changeme/config"
	"changeme/model"
	"database/sql"
	"fmt"
	"reflect"
	"strings"

	"github.com/labstack/gommon/log"
	_ "github.com/mattn/go-sqlite3"
)

var AppDb *sql.DB

var TablesMap = map[string]interface{}{
	config.Table_request_record: model.RequestRecord{},
	config.Table_resp_record:    model.RespRecord{},
	config.Table_env:            model.Env{},
	config.Table_vars:           model.Vars{},
	config.Table_body:           model.Body{},
	config.Table_tab_page:       model.TabPage{},
}

func InitDb(conf model.AppBaseConfig) {

	OpenOrCreateDb(config.DbFileName, conf.DbDir)

	for name, tableStruct := range TablesMap {
		CheckOrCreateTable(name, tableStruct)
	}

}

func OpenOrCreateDb(name string, path string) *sql.DB {

	db, err := sql.Open("sqlite3", fmt.Sprintf("%s/%s", path, name))

	if err != nil {
	}

	AppDb = db

	return AppDb

}

func CheckOrCreateTable(name string, tableStruct interface{}) {

	var checkSql = "SELECT * FROM" + " " + name + ";"

	_, err := AppDb.Query(checkSql)

	if err != nil {

		CreateTableByStruct(name, tableStruct)

	}

}

func CreateTableByStruct(tableName string, tableStruct interface{}) {

	var (
		typeOfTable = reflect.TypeOf(tableStruct)
		num         = typeOfTable.NumField()
		cols        []string
	)

	for idx := 0; idx < num; idx++ {

		var (
			field      = typeOfTable.Field(idx)
			fieldAttrs = field.Tag.Get("db")
			fieldName  = field.Tag.Get("name")
		)

		cols = append(cols, fieldName+" "+fieldAttrs)

	}

	var sqlStr = fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s);", tableName, strings.Join(cols, ","))

	_, err := AppDb.Exec(sqlStr)

	if err != nil {

		log.Info(err.Error())

	}

}
