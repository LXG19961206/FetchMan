package model

type Env struct {
	Id   int    `db:"INTEGER PRIMARY KEY AUTOINCREMENT" name:"id" json:"id"`
	Name string `db:"VARCHAR(128) NULL" name:"name" json:"name"`
}
