import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config }                                 from '../config';

@Injectable()
export class NewService{
	url = config.baseHTTP();
	constructor(
        private newHttp: HttpClient,
	) {
	}

	private dataUrl = this.url + '/mebcrm/clinicdata';

    getData (){
        return this.newHttp.get<any>(this.dataUrl)
    }
}
