package db

import (
	_ "changeme/dicts"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
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

func GetFinalVal(value reflect.Value) string {
	switch value.Kind() {
	case reflect.Bool:
		return strconv.FormatBool(value.Bool())
	case reflect.Int, reflect.Int32, reflect.Int64, reflect.Int16:
		return fmt.Sprintf("%d", value.Int())
	case reflect.Uint, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return fmt.Sprintf("%d", value.Uint())
	case reflect.Float32, reflect.Float64:
		return fmt.Sprintf("%g", value.Float())
	case reflect.String:
		return fmt.Sprintf("%s", value.String())
	default:
		return ""
	}
}

func InsertColByTemplate(name string, col interface{}) (int, string) {

	var (
		keyof   = reflect.TypeOf(col)
		valueOf = reflect.ValueOf(col)
		num     = keyof.NumField()
		fields  []string
		values  []any
	)

	for i := 0; i < num; i++ {

		var (
			field     = keyof.Field(i)
			Name      = field.Name
			fieldName = field.Tag.Get("name")
			value     = GetFinalVal(valueOf.Field(i))
		)

		if !valueOf.FieldByName(Name).IsZero() {
			fields = append(fields, fieldName)
			values = append(values, value)
		}

	}

	var (
		length       = len(values)
		tempValueStr = fmt.Sprintf("%s", strings.Repeat("?,", length))
		finalStr     = fmt.Sprintf("(%s)", tempValueStr[0:len(tempValueStr)-1])
		fieldStr     = fmt.Sprintf("(%s)", strings.Join(fields, ","))
	)

	var sqlStr = "INSERT INTO" + " " + name + " " + fieldStr + " VALUES " + finalStr

	var (
		res, err = AppDb.Exec(sqlStr, values...)
	)

	if err != nil {
		log.Error(values)
		log.Error(err.Error())
		log.Error(sqlStr)
		return 0, err.Error()
	}

	var id, _ = res.LastInsertId()

	return int(id), ""

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

	db, err := sql.Open("sqlite3", fmt.Sprintf("%s/%s", path, name))

	if err != nil {
		log.Info(err.Error())
	}

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
