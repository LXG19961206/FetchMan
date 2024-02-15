package env

import "changeme/models"

type EnvCollection struct {
	models.BaseFields `xorm:"extends"`
	Name              string `json:"name"`
	IsCurrent         bool   `json:"isCurrent"`
}

type Env struct {
	models.BaseFields `xorm:"extends"`
	CollectionId      int64  `json:"collectionId"`
	Current           string `json:"current"`
	IsSecret          bool   `json:"isSecret"`
	CreaterId         int64  `json:"createrId"`
	InitialValue      string `json:"initialValue"`
}

func init() {
	models.CheckOrAppendTable(&EnvCollection{})
	models.CheckOrAppendTable(&Env{})
}
