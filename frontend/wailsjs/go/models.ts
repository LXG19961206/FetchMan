export namespace app {
	
	export class FileInfo {
	    file: number[];
	    name: string;
	    size: number;
	    path: string;
	    content_type: string;
	
	    static createFrom(source: any = {}) {
	        return new FileInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.file = source["file"];
	        this.name = source["name"];
	        this.size = source["size"];
	        this.path = source["path"];
	        this.content_type = source["content_type"];
	    }
	}
	export class SpecialReqHeaderFields {
	    method: string;
	    url: string;
	    times: string;
	    isBinary: string;
	    isFormData: string;
	    instanceId: string;
	
	    static createFrom(source: any = {}) {
	        return new SpecialReqHeaderFields(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.url = source["url"];
	        this.times = source["times"];
	        this.isBinary = source["isBinary"];
	        this.isFormData = source["isFormData"];
	        this.instanceId = source["instanceId"];
	    }
	}

}

export namespace env {
	
	export class Env {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    name: string;
	    isCurrent: boolean;
	    createrId: number;
	
	    static createFrom(source: any = {}) {
	        return new Env(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.name = source["name"];
	        this.isCurrent = source["isCurrent"];
	        this.createrId = source["createrId"];
	    }
	}
	export class Vars {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    envId: number;
	    value: string;
	    initialValue: string;
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new Vars(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.envId = source["envId"];
	        this.value = source["value"];
	        this.initialValue = source["initialValue"];
	        this.name = source["name"];
	    }
	}

}

export namespace filelike {
	
	export class FileLike {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    folderId: number;
	    name: string;
	    type: string;
	    fileId: number;
	    requestId: number;
	    tag: string;
	
	    static createFrom(source: any = {}) {
	        return new FileLike(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.folderId = source["folderId"];
	        this.name = source["name"];
	        this.type = source["type"];
	        this.fileId = source["fileId"];
	        this.requestId = source["requestId"];
	        this.tag = source["tag"];
	    }
	}

}

export namespace folder {
	
	export class Folder {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    createrId: string;
	    name: string;
	    depth: number;
	    parentId: number;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new Folder(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.createrId = source["createrId"];
	        this.name = source["name"];
	        this.depth = source["depth"];
	        this.parentId = source["parentId"];
	        this.type = source["type"];
	    }
	}

}

export namespace request {
	
	export class RequestRecord {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    collectionId: number;
	    url: string;
	    originUrl: string;
	    method: string;
	    headers: {[key: string]: string};
	    contentType: string;
	    bodyId: number;
	    respId: number;
	    body: string;
	    isBinary: boolean;
	    isFormData: boolean;
	    isReferenced: boolean;
	
	    static createFrom(source: any = {}) {
	        return new RequestRecord(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.collectionId = source["collectionId"];
	        this.url = source["url"];
	        this.originUrl = source["originUrl"];
	        this.method = source["method"];
	        this.headers = source["headers"];
	        this.contentType = source["contentType"];
	        this.bodyId = source["bodyId"];
	        this.respId = source["respId"];
	        this.body = source["body"];
	        this.isBinary = source["isBinary"];
	        this.isFormData = source["isFormData"];
	        this.isReferenced = source["isReferenced"];
	    }
	}

}

export namespace tab {
	
	export class Tab {
	    id: number;
	    createTime: string;
	    updateTime: string;
	    deleteTime: string;
	    remark: string;
	    name: string;
	    requestId: number;
	    responseId: number;
	    showFlag: boolean;
	    isCurrent: boolean;
	    method: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new Tab(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.createTime = source["createTime"];
	        this.updateTime = source["updateTime"];
	        this.deleteTime = source["deleteTime"];
	        this.remark = source["remark"];
	        this.name = source["name"];
	        this.requestId = source["requestId"];
	        this.responseId = source["responseId"];
	        this.showFlag = source["showFlag"];
	        this.isCurrent = source["isCurrent"];
	        this.method = source["method"];
	        this.url = source["url"];
	    }
	}

}

