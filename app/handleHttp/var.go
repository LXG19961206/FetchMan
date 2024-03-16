package handlehttp

import (
	dbUtil "changeme/models"
	"changeme/models/env"
	"regexp"
)

func ReplaceVarWithItsRealValue(
	chunkStr string,
	varValueMap map[string]string,
) string {

	reg := regexp.MustCompile(`{{\w+}}`)

	return reg.ReplaceAllStringFunc(chunkStr, func(withVarWrapper string) string {
		var name = reg.FindStringSubmatch(withVarWrapper)[1]
		if realVal, ok := varValueMap[name]; ok {
			return realVal
		} else {
			return ""
		}
	})
}

func GetEnvVarsMap(envId int64) map[string]string {

	var vars = []env.Vars{}

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Find(vars, &env.Vars{
			EnvId: envId,
		})
	}

	var envMap = map[string]string{}

	for _, item := range vars {
		envMap[item.Name] = item.Value
	}

	return envMap

}
