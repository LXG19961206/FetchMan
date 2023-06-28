package db

import (
	"database/sql"
	"fmt"
	"reflect"
	"strings"

	"github.com/labstack/gommon/log"
)

var AppDb *sql.DB

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

	log.Info(sqlStr)

	_, err := AppDb.Exec(sqlStr)

	if err != nil {

		log.Error(err.Error())

	}

}

func InsertColByTemplate(name string, col interface{}) {

	var (
		keyof   = reflect.TypeOf(col)
		valueOf = reflect.ValueOf(col)
		num     = keyof.NumField()
		fields  []string
		values  = []string{}
	)

	for i := 0; i < num; i++ {

		var (
			field = keyof.Field(i).Tag.Get("name")
			value = fmt.Sprintf("%s", valueOf.Field(i))
		)

		fields = append(fields, field)

		values = append(values, value)

	}

	var (
		fieldStr = fmt.Sprintf("(%s)", strings.Join(fields, ","))
		valueStr = fmt.Sprintf("(%s)", strings.Join(values, ","))
	)

	var sqlStr = "INSERT INTO" + " " + name + " " + fieldStr + " VALUES " + valueStr

	log.Info(sqlStr)

	var res, err = AppDb.Exec(sqlStr)

	log.Info(res)

	log.Info(err)

}

func OpenOrCreateDb(name string, path string) *sql.DB {

	db, _ := sql.Open("sqlite3", fmt.Sprintf("%s/%s", path, name))

	AppDb = db

	return AppDb

}

func CheckOrCreateTable(name string, tableStruct interface{}) {

	var checkSql = "SELECT * FROM" + " " + name + ";"

	_, err := AppDb.Query(checkSql)

	if err != nil {

		CreateTableByStruct(name, tableStruct)

		log.Error(err.Error())
	}

}
