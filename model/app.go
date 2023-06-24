package model

import (
	"changeme/config"
)

type AppBaseConfig struct {
	WorkDir   string
	DbDir     string
	CacheDir  string
	RecordDir string
	LogDir    string
	EnvDir    string
}

func (rec *AppBaseConfig) InitOrUpdateConfig(rootPath ...string) {

	homeDir := config.HomeDir

	if len(rootPath) > 0 {
		homeDir = rootPath[0]
	}

	rec.WorkDir = homeDir + config.RootDirName
	rec.DbDir = rec.WorkDir + config.DbDirName
	rec.LogDir = rec.WorkDir + config.LogDirName
	rec.CacheDir = rec.WorkDir + config.CacheDirName
	rec.RecordDir = rec.WorkDir + config.RecordDirName
	rec.EnvDir = rec.WorkDir + config.EnvDirName

}
