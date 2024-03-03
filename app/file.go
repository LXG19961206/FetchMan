package app

import (
	"net/http"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) NativeFileDialog(payload runtime.OpenDialogOptions, onlyPath bool) *FileInfo {

	path, _ := runtime.OpenFileDialog(a.ctx, payload)

	return GetFileInfo(path)

}

type FileInfo struct {
	File        []byte
	Name        string
	Size        int64
	Path        string
	ContentType string
}

func GetFileInfo(path string) *FileInfo {

	file, err := os.Open(path)

	if err != nil {
		return nil
	}

	defer func() {
		_ = file.Close()
	}()

	fileInfo, _ := file.Stat()

	buf := make([]byte, fileInfo.Size())

	_, _ = file.Read(buf)

	contentType := http.DetectContentType(buf)

	var info = &FileInfo{
		Path:        path,
		ContentType: contentType,
		File:        buf,
		Name:        fileInfo.Name(),
	}

	return info

}
