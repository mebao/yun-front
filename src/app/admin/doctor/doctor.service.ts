import { Http }                          from '@angular/http';
import { Injectable }                    from '@angular/core';

import { Data }                          from '../data';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DoctorService{
	private url = 'http://192.168.31.200/jiabaokangle';
	// private url = 'http://wapapi.jiabaokangle.com';
	// private url = 'http://wapapi.meb168.com';

	constructor(
        private http: Http,
    ) {}

    // 创建儿保记录模板
    private recordtempletUrl = this.url + '/mebcrm/recordtemplet';
    recordtemplet(params): Promise<Data>{
        return this.http.post(this.recordtempletUrl, JSON.stringify(params))
            .toPromise()
            .then(response => response.json() as Data)
            .catch();
    }

	// 查看医生儿保记录模板
	private searchrecordtempletUrl = this.url + '/mebcrm/searchrecordtemplet';
	searchrecordtemplet(urlOptions): Promise<Data>{
		return this.http.get(this.searchrecordtempletUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 查看儿保记录字段
	private searchrecordkeysUrl = this.url + '/mebcrm/searchrecordkeys';
	searchrecordkeys(urlOptions): Promise<Data>{
		return this.http.get(this.searchrecordkeysUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 修改医生儿保记录模板使用状态
	private recordtempletstatusUrl = this.url + '/mebcrm/recordtempletstatus/';
	recordtempletstatus(urlOptions, params): Promise<Data>{
		return this.http.post(this.recordtempletstatusUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 修改医生儿保记录模板
	private updaterecordtempletUrl = this.url + '/mebcrm/updaterecordtemplet/';
	updaterecordtemplet(urlOptions, params): Promise<Data>{
		return this.http.post(this.updaterecordtempletUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}
}
