import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { Data } from './admin/data';
import { config }  from './config';

@Injectable()
export class AuthService {
	url = config.baseHTTP;

  	isLoggedIn: boolean = true;

  	redirectUrl: string;

  	constructor(private http: Http) {}

	private loginUrl = this.url + '/mebcrm/adminlogin';
	login(username: string, password: string): Promise<Data>{
		return this.http.post(this.loginUrl, JSON.stringify({username: username, password: password}))
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 忘记密码
	private forgetpwdUrl = this.url + '/mebcrm/forgetpwd';
	forgetpwd(params): Promise<Data>{
		let options = new RequestOptions({withCredentials: true});
		return this.http.post(this.forgetpwdUrl, JSON.stringify(params), options)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

	// 发送短信验证码
	private smsverifycodeUrl = this.url + '/mebcrm/smsverifycode';
	smsverifycode(params): Promise<Data>{
		let options = new RequestOptions({withCredentials: true});
		return this.http.post(this.smsverifycodeUrl, JSON.stringify(params), options)
			.toPromise()
			.then(response => response.json() as Data)
			.catch();
	}

  	logout(): void {
    	this.isLoggedIn = false;
  	}
}
