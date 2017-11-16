import { Http }                          from '@angular/http';
import { Injectable }                    from '@angular/core';

import { Data }                          from '../data';
import { config }                        from '../../config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DoctorService{
	url = config.baseHTTP;

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

	// 当日值班医生及其登记患者
	private doctorworkUrl = this.url + '/mebcrm/doctorwork';
	doctorwork(urlOptions): Promise<Data>{
		return this.http.get(this.doctorworkUrl + urlOptions)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 开始或结束就诊
	private updateserviceUrl = this.url + '/mebcrm/updateservice/';
	updateservice(urlOptions, params): Promise<Data>{
		return this.http.post(this.updateserviceUrl + urlOptions, JSON.stringify(params))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}
}
