package model

type Vars struct {
	Id         int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Name       string `db:"VARCHAR(128) NULL" name:"name" json:"name"`
	EnvId      int    `db:"INTEGER NULL" name:"env_id" json:"env_id"`
	EnvName    string `db:"VARCHAR(128) NULL" name:"env_name" json:"env_name"`
	Value      any    `db:"TEXT NULL" name:"value" json:"value"`
	CreateTime string `db:"DATE NULL" name:"create_time" json:"createTime"`
}
