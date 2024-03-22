package handlehttp

import (
	dbUtil "changeme/models"
	"changeme/models/env"
	"fmt"
	"regexp"
)

func IsVar(str string) bool {
	reg := regexp.MustCompile(`.*{{(\w+)}}.*`)
	return reg.MatchString(str)
}

func ReplaceVarWithItsRealValue(
	chunkStr string,
	varValueMap map[string]string,
) string {

	if chunkStr == "" {
		return chunkStr
	}

	reg := regexp.MustCompile(`{{(\w+)}}`)

	return reg.ReplaceAllStringFunc(chunkStr, func(withVarWrapper string) string {

		fmt.Printf("withVarWrapper: %v\n", withVarWrapper)

		fmt.Printf("reg.FindStringSubmatch(withVarWrapper): %v\n", reg.FindStringSubmatch(withVarWrapper))

		var name = reg.FindStringSubmatch(withVarWrapper)[1]
		if realVal, ok := varValueMap[name]; ok {
			return realVal
		} else {
			return ""
		}
	})
}

func GetEnvVarsMap() map[string]string {

	var vars = []env.Vars{}
	var currentEnv = &env.Env{
		IsCurrent: true,
	}

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {
		engine.Get(&currentEnv)
		engine.Find(&vars, &env.Vars{
			EnvId: currentEnv.Id,
		})
	}
	var envMap = map[string]string{}
	for _, item := range vars {
		envMap[item.Name] = item.Value
	}
	return envMap
}
