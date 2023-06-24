package app

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) NativeMessageDialog(payload runtime.MessageDialogOptions) string {

	res, err := runtime.MessageDialog(a.ctx, payload)

	if err == nil {
	}

	return res

}
