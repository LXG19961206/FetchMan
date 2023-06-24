package model

type RespRecord struct {
	Url         string `db:"TEXT NULL" name:"url" json:"url"`
	Method      string `db:"VARCHAR(32) NULL" name:"method" json:"method"`
	Id          int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Status      int    `db:"INTEGER NULL" name:"status" json:"status"`
	Headers     string `db:"TEXT NULL" name:"headers" json:"header"`
	ContentType string `db:"VARCHAR(128) NULL" name:"content_type" json:"ContentType"`
	BodyId      any    `db:"INTEGER NULL" name:"body_id" json:"bodyId"`
	ReqId       int    `db:"INTEGER NULL" name:"req_id" json:"reqId"`
	CreateTime  string `db:"DATE NULL" name:"create_time" json:"createTime"`
}

type AppResp struct {
	StatusCode int
	Status     string
	Headers    [][2]string
	Body       interface{}
	ReqHeaders [][2]string
}
