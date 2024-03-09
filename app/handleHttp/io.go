package handlehttp

import (
	dbUtil "changeme/models"
	fileLike "changeme/models/fileLike"
	req "changeme/models/request"
	tabTable "changeme/models/tab"
	"fmt"
	"net/http"
)

func UpdateRequestInfo(record *req.RequestRecord) {

	if engine, err := dbUtil.GetSqLiteEngine(); err == nil {

		fmt.Printf("record.Id: %v\n", record.Id)
		fmt.Printf("record.Url: %v\n", record.Url)

		engine.Table(&req.RequestRecord{}).ID(record.Id).AllCols().Update(record)

		var tab = &tabTable.Tab{
			RequestId: record.Id,
		}

		engine.Get(tab)

		var filelikeRecord = &fileLike.FileLike{
			RequestId: record.Id,
		}

		engine.Get(filelikeRecord)

		fmt.Printf("filelikeRecord: %v\n", filelikeRecord)

		filelikeRecord.Tag = record.Method

		if record.Url != "" {
			if len(record.Url) > 20 {
				tab.Url = record.Url[0:20]
			} else {
				tab.Url = record.Url
			}
		}
		tab.Method = record.Method
		engine.ID(tab.Id).Update(tab)
		engine.ID(filelikeRecord.Id).Update(filelikeRecord)
	}

}

func SaveResp(req *http.Response) {
}
