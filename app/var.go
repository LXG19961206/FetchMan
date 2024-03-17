package app

import (
	dbUtil "changeme/models"
	"changeme/models/env"
)

func (a *App) SetCurrent(id int64) {

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {

		var envs = []env.Env{}

		engine.Find(&envs)

		for idx := range envs {
			envs[idx].IsCurrent = envs[idx].Id == id
			engine.Table(&env.Env{}).ID(envs[idx].Id).AllCols().Update(envs[idx])
		}

	}
}

func (a *App) LsAllEnv() []env.Env {
	var envs = []env.Env{}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Find(&envs)
	}
	return envs
}

func (a *App) RenameEnv(id int64, name string) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &env.Env{}
		engine.ID(id).Get(record)
		record.Name = name
		engine.ID(id).Update(record)
	}
}

func (a *App) DelEnv(id int64) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.ID(id).Delete(&env.Env{})
		engine.Delete(&env.Vars{
			EnvId: id,
		})
	}
}

func (a *App) AddEnv() *env.Env {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		var record = &env.Env{
			Name: "please rename",
		}
		engine.Insert(record)
		return record
	}
	return nil
}

func (a *App) AddVariable(envId int64, name string) {

	if envId == 0 {
		return
	}

	var record = &env.Vars{
		EnvId: envId,
		Name:  name,
	}

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Insert(record)
	}

}

func (a *App) ModifyVariable(envId int64, record env.Vars) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.ID(record.Id).Update(record)
	}
}

func (a *App) GetVarsByEnvId(id int64) []env.Vars {
	var vars = []env.Vars{}
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Where("env_id = ?", id).Find(&vars)
	}
	return vars
}

func (a *App) DelVars(id int64) {
	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.ID(id).Delete(new(env.Vars))
	}
}
