import { Component, OnInit }               from '@angular/core';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'app-clinicroom-records',
	templateUrl: './clinicroom-records.component.html',
})
export class ClinicroomRecordsComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type: string,
	};
	hasData: boolean;
	url: string;
	conditions: any[];
	conditionList: any[];
	doctorList: any[];
	search: {
		type: string,
		room_no: string,
		doctor_id: string,
	}

	constructor(public adminService: AdminService) {}

	ngOnInit() {
		this.topBar = {
			title: '诊室使用记录',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;

		this.url = '?username=' + this.adminService.getUser().username
				 + '&token=' + this.adminService.getUser().token
				 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.conditions = [];
		this.conditionList = [];
		this.doctorList = [];
		this.search = {
			type: '',
			room_no: '',
			doctor_id: '',
		}

		//获取诊室列表
		this.adminService.clinicconditions(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				results.conditions.unshift({id: '', name: '', roomNo: ''});
				this.conditionList = results.conditions;
			}
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });

		//获取医生列表
		var adminlistUrl = this.url + '&role=2';
		this.adminService.adminlist(adminlistUrl).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				results.adminlist.unshift({id: '', realName: ''});
				this.doctorList = results.adminlist;
			}
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });

		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.clinicconditionrecords(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.conditions = results.conditions;
				this.hasData = true;
			}
		}).catch(() => {
            this.toastTab('服务器错误', 'error');
        });
	}

	searchChange() {
		var searchUrl = this.url;
		if(this.search.type != ''){
			searchUrl += ('&type=' + this.search.type);
		}
		if(this.search.room_no != ''){
			searchUrl += ('&room_no=' + this.search.room_no);
		}
		if(this.search.doctor_id != ''){
			searchUrl += ('&doctor_id=' + this.search.doctor_id);
		}
		this.getData(searchUrl);
	}

	toastTab(text, type) {
		this.toast = {
			show: 1,
			text: text,
			type: type,
		}
		setTimeout(() => {
	    	this.toast = {
				show: 0,
				text: '',
				type: '',
			}
	    }, 2000);
	}
}
