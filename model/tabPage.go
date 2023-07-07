package model

type TabPage struct {
	Id          int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	WorkplaceId int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"workplace_id" json:"workplace_id"`
	CreateTime  string `db:"DATE NULL" name:"create_time" json:"createTime"`
	ReqId       int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"req_id" json:"req_id"`
}
