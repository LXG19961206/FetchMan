package file

import (
	"changeme/model"
	"net/http"
	"os"
	"time"
)

var LastFileCache *model.FileInfo

func GetFileInfo(path string) *model.FileInfo {

	file, err := os.Open(path)

	if err != nil {
		return &model.FileInfo{}
	}

	defer func() {
		_ = file.Close()
	}()

	fileInfo, _ := file.Stat()

	buf := make([]byte, fileInfo.Size())

	_, _ = file.Read(buf)

	contentType := http.DetectContentType(buf)

	LastFileCache = &model.FileInfo{
		Id:          int(time.Now().UnixMilli()),
		Path:        path,
		ContentType: contentType,
		File:        buf,
		FileName:    fileInfo.Name(),
	}

	return LastFileCache
}
