package app

import (
	"changeme/config"
	"changeme/model"
	"changeme/service/db"
	"time"
)

func (a *App) StartNewTab() int {

	var newTab = &model.TabPage{
		WorkplaceId: 0,
		CreateTime:  time.Now().String(),
	}

	id, _ := db.InsertColByTemplate(config.Table_tab_page, *newTab)

	return id

}

func (a *App) UpdateTabInfo(info *model.TabPage) string {

	var id = info.Id

	var err = db.UpadteColById(config.Table_tab_page, *info, id)

	if err != nil {
		return err.Error()
	} else {
		return ""
	}

}

func (a *App) CloseTab(id int) {

	db.DeleteColById(config.Table_tab_page, id)

}

func (a *App) LsAllTabs() []map[string]interface{} {

	return db.SelectFieldByMap(config.Table_tab_page, []string{"*"}, map[string]any{})

}
