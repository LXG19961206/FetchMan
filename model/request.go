package model

type RequestRecord struct {
	WorkplaceFlag string `db:"BOOLEAN NULL" name:"workplace_flag" json:"workplaceFlag"`
	Id            int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Url           string `db:"TEXT NULL" name:"url" json:"url"`
	OriginUrl     string `db:"TEXT NULL" name:"origin_url" json:"originUrl"`
	Method        string `db:"VARCHAR(16) NULL" name:"method" json:"method"`
	EnvId         int    `db:"INTEGER NULL" name:"env_id" json:"envId"`
	Headers       string `db:"TEXT NULL" name:"headers" json:"headers"`
	ContentType   string `db:"VARCHAR(128) NULL" name:"content_type" json:"contentType"`
	Name          string `db:"VARCHAR(255) NULL" name:"name" json:"name"`
	BodyId        int    `db:"INTEGER NULL" name:"body_id" json:"bodyId"`
	RespId        int    `db:"INTEGER NULL" name:"resp_id" json:"respId"`
	CreateTime    string `db:"DATE NULL" name:"create_time" json:"createTime"`
}

type ReqBody struct {
	Type     string
	Value    string
	FilePath string
	FileId   int
	Name     string
	FormData []*ReqBody
}

type AppRequest struct {
	Url     string
	Method  string
	Headers [][2]string
	Body    ReqBody
	Id      int
}
