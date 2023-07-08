package model

type TabPage struct {
	Id          int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	WorkplaceId int    `db:"INTEGER NULL" name:"workplace_id" json:"workplace_id"`
	CreateTime  string `db:"DATE NULL" name:"create_time" json:"createTime"`
	ReqId       int    `db:"INTEGER NULL" name:"req_id" json:"req_id"`
	Method      string `db:"VARCHAR(16) NULL" name:"method" json:"method"`
	Url         string `db:"TEXT NULL" name:"url" json:"url"`
}

func (rec *TabPage) BindRequestWithTab(reqId int) {
	rec.ReqId = reqId
}
