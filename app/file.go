package app

import (
	"changeme/model"
	"changeme/service/file"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"time"
)

func (a *App) NativeFileDialog(payload runtime.OpenDialogOptions, onlyPath bool) *model.FileInfo {

	path, _ := runtime.OpenFileDialog(a.ctx, payload)

	if onlyPath {
		return &model.FileInfo{
			Path: path,
			Id:   int(time.Now().UnixMilli()),
		}
	}

	return file.GetFileInfo(path)

}
