package db

import (
	"fmt"
	"strings"
)

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
		res, err = GetAppDb().Exec(sqlStr, values...)
	)

	if err != nil {
		return 0, err.Error()
	}

	var id, _ = res.LastInsertId()

	return int(id), ""

}
