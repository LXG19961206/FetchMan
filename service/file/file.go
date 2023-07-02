package file

import (
	"changeme/model"
	"fmt"
	"net/http"
	"os"
	"time"
)

var LastFileCache *model.FileInfo

var ContentTypeToExtension = map[string]string{
	"image/jpeg":                   ".jpg",
	"image/png":                    ".png",
	"image/gif":                    ".gif",
	"image/bmp":                    ".bmp",
	"image/webp":                   ".webp",
	"image/svg+xml":                ".svg",
	"application/pdf":              ".pdf",
	"application/zip":              ".zip",
	"application/x-tar":            ".tar",
	"application/x-gzip":           ".gz",
	"application/x-bzip2":          ".bz2",
	"application/x-rar-compressed": ".rar",
	"application/x-7z-compressed":  ".7z",
	"application/vnd.ms-excel":     ".xls",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
	"application/msword": ".doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":   ".docx",
	"application/vnd.ms-powerpoint":                                             ".ppt",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
	"application/json":    ".json",
	"text/plain":          ".txt",
	"text/html":           ".html",
	"text/css":            ".css",
	"text/javascript":     ".js",
	"application/xml":     ".xml",
	"application/rss+xml": ".rss",
}

func GetExtName(contentType string) string {

	if val, ok := ContentTypeToExtension[contentType]; ok {
		return fmt.Sprintf("%s", val)
	} else {
		return ""
	}

}

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
