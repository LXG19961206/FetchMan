package db

import (
	_ "changeme/dicts"
	"changeme/launch"
	"database/sql"
	"fmt"
	"reflect"
	"strconv"
)

func GetAppDb() *sql.DB {
	return launch.AppDb
}

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
