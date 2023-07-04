package db

import (
	_ "changeme/dicts"
	"changeme/launch"
	"fmt"
	"github.com/labstack/gommon/log"
	"reflect"
	"strconv"
	"strings"
)

func GetReflectStringifyVal(value reflect.Value) string {
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

func GetFieldsAndValues(col interface{}) ([]string, []any) {
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
			value     = GetReflectStringifyVal(valueOf.Field(i))
		)

		if !valueOf.FieldByName(Name).IsZero() {
			fields = append(fields, fieldName)
			values = append(values, value)
		}

	}

	return fields, values
}

func InsertColByTemplate(name string, col interface{}) (int, string) {

	var fields, values = GetFieldsAndValues(col)

	var (
		length       = len(values)
		tempValueStr = fmt.Sprintf("%s", strings.Repeat("?,", length))
		finalStr     = fmt.Sprintf("(%s)", tempValueStr[0:len(tempValueStr)-1])
		fieldStr     = fmt.Sprintf("(%s)", strings.Join(fields, ","))
	)

	var sqlStr = "INSERT INTO" + " " + name + " " + fieldStr + " VALUES " + finalStr

	var (
		res, err = launch.AppDb.Exec(sqlStr, values...)
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
