import { Component, OnInit }               from '@angular/core';
import { Router }                          from '@angular/router';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'app-scheduling-config-list',
	templateUrl: './scheduling-config-list.component.html',
})
export class SchedulingConfigListComponent{
	toast: {
		show: number,
		text: string,
		type: string,
	}
	url: string;
	hasData: boolean;
	dutylist: any[];
	status: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}
		this.hasData = false;
		this.dutylist = [];
		this.status = '';
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.getData(this.url);
	}

	getData(urlOptions) {
		this.adminService.scheduling(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				var use = [];
				var notuse = [];
				if(results.dutylist.length > 0){
					for(var i = 0; i < results.dutylist.length; i++){
						if(results.dutylist[i].status == 1){
							use.push(results.dutylist[i]);
						}else{
							notuse.push(results.dutylist[i]);
						}
					}
				}
				this.dutylist = use.concat(notuse);
				this.hasData = true;
			}
		})
	}

	goCreate() {
		this.router.navigate(['./admin/schedulingConfig']);
	}

	statusChange(_value) {
		var urlOptions = this.url + '&status=' + _value;
		this.getData(urlOptions);
	}

	update(duty) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: duty.id,
			status: (duty.status == 1 ? 0 : 1).toString(),
		}

		this.adminService.dutystatus(duty.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab((duty.status == 1 ? '停用' : '启用') + '成功', '');
				var urlOptions = this.url;
				if(this.status != ''){
					urlOptions += '&status=' + this.status;
				}
				this.getData(urlOptions);
			}
		})
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