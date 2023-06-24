package launch

import (
	"changeme/model"
	"fmt"
	"os"
	"reflect"
)

func HandleFolder(pathConfig model.AppBaseConfig) {
	var (
		typeValue = reflect.TypeOf(pathConfig)
		num       = typeValue.NumField()
	)
	for idx := 0; idx < num; idx++ {
		path := fmt.Sprintf("%s", reflect.ValueOf(pathConfig).Field(idx).Interface())
		CheckOrMakeDir(path)
	}
}

func CheckOrMakeDir(path string) {
	fileInfo, err := os.Stat(path)
	if err == nil {
		if !fileInfo.IsDir() {
			_ = os.MkdirAll(path, 0755)
		}
	} else if exist := !os.IsNotExist(err); !exist {
		_ = os.MkdirAll(path, 0755)
	}
}
