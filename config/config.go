package config

import (
	"os/user"
	"time"
)

const (
	RootDirName   = "/FetchMan"
	DbDirName     = "/db"
	CacheDirName  = "/cache"
	RecordDirName = "/record"
	EnvDirName    = "/env"
	LogDirName    = "/log"
	DbFileName    = "FetchMan.db"
)

var (
	userInfo, _ = user.Current()
	HomeDir     = userInfo.HomeDir
	LogFileName = time.Now().Format("2006-01-02")
)
