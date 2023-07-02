package launch

import (
	"changeme/config"
	"changeme/model"
	"fmt"
	"net"
	"net/http"
	"os"
	"reflect"
)

func StartFileServer(path string) int {

	fs := http.FileServer(http.Dir(path))

	http.Handle("/", http.StripPrefix("/", fs))

	var port = config.DefaultFileServerPort

	err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), nil)

	if err != nil {
		AppLogger.Error().Msg(err.Error())
	}

	return port
}

func GetPortNotUse() int {
	listener, err := net.Listen("tcp", ":0")

	if err != nil {
		return config.DefaultFileServerPort
	} else {
		var addr = listener.Addr().(*net.TCPAddr)
		return addr.Port
	}

}

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
