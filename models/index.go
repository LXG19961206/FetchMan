package models

import (
	"xorm.io/xorm"
)

var DbEngine *xorm.Engine

type BaseFields struct {
	Id         int64  `xorm:"pk autoincr" json:"id"`
	CreateTime string `xorm:"created" json:"createTime"`
	UpdateTime string `xorm:"updated" json:"updateTime"`
}

func init() {
	GetSqLiteEngine()
}

func GetSqLiteEngine() (*xorm.Engine, error) {
	if DbEngine != nil {
		return DbEngine, nil
	}
	if engine, err := xorm.NewEngine("sqlite3", "./test_folder.db"); err == nil {
		DbEngine = engine
		return DbEngine, nil
	} else {
		return nil, err
	}
}

func CheckOrAppendTable(table any) {
	var engine, err = GetSqLiteEngine()
	if err == nil {
		engine.Sync(table)
	}
}

func BasePhyDel(id int64, model any) error {
	if engine, err := GetSqLiteEngine(); err == nil {
		_, err := engine.ID(id).Delete(model)
		return err
	} else {
		return err
	}
}

func BaseRename(newName string, id int64, model any) error {
	return UniversalUpdate(map[string]any{"name": newName}, id, model)
}

func UniversalUpdate(newVal map[string]any, id int64, model any) error {
	if engine, err := GetSqLiteEngine(); err == nil {
		engine.ID(id).Get(model)
		_, err := engine.Table(model).ID(id).Update(newVal)
		return err
	} else {
		return err
	}
}
