package db

import (
	"changeme/launch"
	"fmt"
	"strings"

	"github.com/labstack/gommon/log"
)

func SelectFieldByMap(name string, cols []string, filedMap map[string]any) []map[string]interface{} {

	var (
		subQuerySqls []string
	)

	var finalColsStr = func() string {
		if len(cols) == 0 {
			return "*"
		} else {
			return strings.Join(cols, ",")
		}
	}()

	var subValues []interface{}

	for field, value := range filedMap {
		subQuerySqls = append(subQuerySqls, fmt.Sprintf("%s=?", field))
		subValues = append(subValues, value)
	}

	var finalQueryStr = func() string {
		if len(subQuerySqls) == 0 {
			return ""
		} else {
			return fmt.Sprintf("WHERE %s", strings.Join(subQuerySqls, " and "))
		}
	}()

	var finalSql = fmt.Sprintf("SELECT %s FROM %s %s;", finalColsStr, name, finalQueryStr)

	log.Info(finalSql)

	rows, err := GetAppDb().Query(finalSql, subValues...)

	if err != nil {

	}

	defer rows.Close()

	fields, err := rows.Columns()

	log.Info(fields)

	values := make([]interface{}, len(fields))

	valuesPot := make([]interface{}, len(fields))

	for i := range values {
		valuesPot[i] = &values[i]
	}

	var result []map[string]interface{}

	for rows.Next() {

		err := rows.Scan(valuesPot...)

		if err != nil {
			launch.AppLogger.Error().Msg(err.Error())
		}

		var colMap = make(map[string]interface{})

		// 打印字段名和字段值
		for i, col := range values {

			var filed = fields[i]

			colMap[filed] = col

		}

		result = append(result, colMap)

	}

	return result

}
