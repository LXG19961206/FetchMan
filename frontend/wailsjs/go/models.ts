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

