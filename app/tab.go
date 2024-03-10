package app

import (
	dbUtil "changeme/models"
	filelike "changeme/models/fileLike"
	"changeme/models/request"
	tabTable "changeme/models/tab"
)

func (a *App) CreateNewTab() (*tabTable.Tab, error) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		// 创建一个 新的窗口 tab 其实是创建一个新的请求实例
		if newReq, createErr := CreateBlankRequest(); createErr == nil {
			// 然后将 req 实例和 tab窗口关联起来
			var tab = &tabTable.Tab{
				RequestId: newReq.Id,
				Method:    newReq.Method,
			}
			var _, InsertErr = engine.Insert(tab)
			return tab, InsertErr
		} else {
			return nil, createErr
		}
	} else {
		return nil, err
	}
}

func LsTabs() []*tabTable.Tab {
	var tabs []*tabTable.Tab
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Find(&tabs)
		return tabs
	} else {
		return tabs
	}
}

// 返还客户端当前所有的 tab
func (a *App) ClientLsTabs() []*tabTable.Tab {
	var tabs = LsTabs()
	if len(tabs) > 0 {
		return tabs
	} else {
		var newTab, _ = Application.CreateNewTab()
		tabs = append(tabs, newTab)
		return tabs
	}
}

/*
	   关闭 tab 的时候，首先会删掉这个 tab record 本身
		 然后查询这个 tab 对应的 request 是否和 工作区的实体有联动
		 如果没有，证明是个临时游离的请求，也会随着 tab 的关闭也一起关闭
		 如果有，那它对应的请求暂时还不能被删除
*/
func (a *App) CloseTab(id int64) {
	var tabRecord = &tabTable.Tab{}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.ID(id).Get(tabRecord)
		engine.ID(id).Delete(tabRecord)
		var count, _ = engine.Where("request_id = ?", tabRecord.RequestId).Count(&filelike.FileLike{})
		if count == 0 {
			engine.ID(tabRecord.RequestId).Delete(&request.RequestRecord{})
		}
	}
}

func (a *App) CloseTabMul(ids []int64) {
	var engine, err = dbUtil.GetSqLiteEngine()
	if err == nil {
		engine.In("id", ids).Delete(&tabTable.Tab{})
	}
}

func (a *App) RenameTab(newName string, id int64) {
	dbUtil.BaseRename(newName, id, &tabTable.Tab{})
}

func (a *App) DuplicateTab(id int64) []*tabTable.Tab {
	var engine, err = dbUtil.GetSqLiteEngine()
	if err == nil {
		var current = &tabTable.Tab{}
		engine.ID(id).Get(current)
		var newReq = Application.CopyRequest(current.RequestId)
		current.RequestId = newReq.Id
		current.Id = 0
		current.Name = current.Name + " copy"
		engine.Insert(current)
	}
	return Application.ClientLsTabs()
}

func (a *App) CreateOrUseExistTab(reqId int64, name string, tag string) int64 {

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &tabTable.Tab{RequestId: reqId}
		engine.Get(record)
		// if not find
		if record.Id == 0 {
			record.Name = name
			record.Method = tag
			engine.Insert(record)
			return record.Id
		} else {
			return record.Id
		}
	}

	return 0
}
