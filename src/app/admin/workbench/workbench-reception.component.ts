import { Component, OnInit }             from '@angular/core';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './workbench-reception.component.html',
})
export class WorkbenchReceptionComponent{
	weektitle: any[];
	schedulinglist: any[];
	weekNum: number;
	url: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};

	constructor(public adminService: AdminService) {}

	ngOnInit(): void{
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.weekNum = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		var urlOptions = this.url + '&weekindex=' + this.weekNum;
		this.getList(urlOptions);
	}

	getList(urlOptions) {
		this.adminService.adminduty(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var adminduty = JSON.parse(JSON.stringify(data.results)).adminduty;
				if(adminduty.length > 0){
					var weekArray = this.adminService.getWeekByNumber(this.weekNum);
					var weektitle = [];
					//先遍历医生
					for(var i = 0; i < adminduty.length; i++){
						adminduty[i].weekScheduling = [];
						for(var j = 0; j < weekArray.length; j++){
							var title = {
								date: weekArray[j],
								title: this.adminService.getWeekTitle(j)
							}
							var scheduling = {
								dutyDay: weekArray[j],
								dutyId: '',
								dutyName: ''
							}
							if(adminduty[i].DutyList.length > 0){
								for(var k = 0; k < adminduty[i].DutyList.length; k++){
									if(weekArray[j] == adminduty[i].DutyList[k].dutyDay){
										scheduling = adminduty[i].DutyList[k];
									}
								}
							}
							if(i == 0){
								weektitle.push(title);
							}
							adminduty[i].weekScheduling.push(scheduling);
						}
					}
				}
				this.weektitle = weektitle;
				this.schedulinglist = adminduty;
			}
		})
	}

	prec() {
		this.weekNum--;
		var urlOptions = this.url + '&weekindex=' + this.weekNum;
		this.getList(urlOptions);
	}

	now() {
		this.weekNum = 0;
		var urlOptions = this.url + '&weekindex=' + this.weekNum;
		this.getList(urlOptions);
	}

	next() {
		this.weekNum++;
		var urlOptions = this.url + '&weekindex=' + this.weekNum;
		this.getList(urlOptions);
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