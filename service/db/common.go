package db

import (
	"database/sql"
	"fmt"
	"github.com/labstack/gommon/log"
	"reflect"
	"strings"
)

func CreateTableByStruct(db *sql.DB, dbName string, tableStruct interface{}) {

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

	var sqlStr = fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s);", dbName, strings.Join(cols, ","))

	log.Info(sqlStr)

	_, err := db.Exec(sqlStr)

	if err != nil {

		log.Error(err.Error())

	}

}

func InsertColByMap(db *sql.DB, name string, valueMap map[string]string) {

	var keys, values []string

	for key, value := range valueMap {
		keys = append(keys, key)
		values = append(values, value)
	}

	var (
		keyStr = fmt.Sprintf("(%s)", strings.Join(keys, ","))
		valStr = fmt.Sprintf("(%s)", strings.Join(values, ","))
	)

	var sqlStr = "INSERT INTO" + " " + name + " " + keyStr + " VALUES " + valStr

	var _, _ = db.Exec(sqlStr)

}

func OpenOrCreateDb(name string, path string) *sql.DB {

	db, _ := sql.Open("sqlite3", fmt.Sprintf("%s/%s", path, name))

	return db

}

func CheckOrCreateTable(db *sql.DB, name string, tableStruct interface{}) {

	var checkSql = "SELECT * FROM" + " " + name + ";"

	_, err := db.Query(checkSql)

	if err != nil {

		CreateTableByStruct(db, name, tableStruct)

		log.Error(err.Error())
	}

}
