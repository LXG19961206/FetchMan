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
	    }
	}

}

export namespace filelike {
	
	export class FileLike {
	    id: number;
	    createTime: string;
	    updateTime: string;
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
	        this.createrId = source["createrId"];
	        this.name = source["name"];
	        this.depth = source["depth"];
	        this.parentId = source["parentId"];
	        this.type = source["type"];
	    }
	}

}

export namespace model {
	
	
	export class TabPage {
	    id: number;
	    workplace_id: number;
	    createTime: string;
	    req_id: number;
	    method: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new TabPage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.workplace_id = source["workplace_id"];
	        this.createTime = source["createTime"];
	        this.req_id = source["req_id"];
	        this.method = source["method"];
	        this.url = source["url"];
	    }
	}

}

