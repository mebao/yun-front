import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { Data } from './admin/data';

@Injectable()
export class AuthService {
	private url = 'http://192.168.31.200/jiabaokangle';
	// private url = 'http://wapapi.jiabaokangle.com';
	// private url = 'http://wapapi.meb168.com';

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

  	logout(): void {
    	this.isLoggedIn = false;
  	}
}
