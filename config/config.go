package config

import (
	"os/user"
	"time"
)

const (
	RootDirName           = "/FetchMan"
	DbDirName             = "/db"
	CacheDirName          = "/cache"
	RecordDirName         = "/record"
	RecordBodyDirName     = "/record/body"
	EnvDirName            = "/env"
	LogDirName            = "/log"
	DbFileName            = "FetchMan.db"
	BodyFileMinByteSize   = 1024 * 2
	DefaultFileServerPort = 30399
)

var (
	userInfo, _ = user.Current()
	HomeDir     = userInfo.HomeDir
	LogFileName = time.Now().Format("2006-01-02")
)

// tables name
const (
	Table_request_record = "request_record"
	Table_resp_record    = "resp_record"
	Table_env            = "env"
	Table_vars           = "vars"
	Table_body           = "body"
)
