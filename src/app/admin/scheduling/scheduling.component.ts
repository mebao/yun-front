import { Component, OnInit }             from '@angular/core';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './scheduling.component.html',
})
export class SchedulingComponent{
	weektitle: any[];
	schedulinglist: any[];
	weekNum: number;
	url: string;
	schedulingConfigs: any[];
	config: string;
	modalTab: boolean;
	info: string;
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	changeData: {
		_id: string,
		value: string,
		adminId: string,
		adminName: string,
		date: string,
	}

	constructor(public adminService: AdminService) {}

	ngOnInit(): void{
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.changeData = {
			_id: '',
			value: '',
			adminId: '',
			adminName: '',
			date: '',
		}

		this.modalTab = false;
		this.info = '';

		this.weekNum = 0;
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		var urlOptions = this.url + '&weekindex=' + this.weekNum;
		this.getList(urlOptions);

		//排班配置列表
		var schedulingUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
        this.adminService.scheduling(schedulingUrl).then((data) => {
        	if(data.status == 'no'){
        		this.toastTab(data.errorMsg, 'error');
        	}else{
        		var results = JSON.parse(JSON.stringify(data.results));
        		results.dutylist.unshift({
        			id: '',
        			name: '',
        			status: '',
        		});
        		for(var i = 0; i < results.dutylist.length; i++){
        			results.dutylist[i].string = JSON.stringify(results.dutylist[i]);
        		}
        		this.schedulingConfigs = results.dutylist;
        	}
        })
	}

	getList(urlOptions) {
		this.adminService.adminduty(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var adminduty = JSON.parse(JSON.stringify(data.results)).adminduty;
				var todayTime = new Date().getTime();
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
								dutyName: '',
								id: '',
								use: true,
							}
							if(adminduty[i].DutyList.length > 0){
								for(var k = 0; k < adminduty[i].DutyList.length; k++){
									if(weekArray[j] == adminduty[i].DutyList[k].dutyDay){
										scheduling = adminduty[i].DutyList[k];
									}
								}
							}
							//判断日期是否已经过去，设置不可编辑
							if(new Date(weekArray[j]).getTime() < (todayTime - 24*60*60*1000)){
								scheduling.use = false;
							}else{
								scheduling.use = true;
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

	configChange(_id, value, adminId, adminName, date) {
		this.changeData = {
			_id: _id,
			value: value,
			adminId: adminId,
			adminName: adminName,
			date: date,
		}
		if(this.changeData._id && this.changeData._id != ''){
			if(this.changeData.value && JSON.parse(this.changeData.value).id != ''){
				//修改
				this.info = '确定修改排班';
			}else{
				//删除
				this.info = '确定删除排班';
			}
		}else{
			//新增
			this.info = '确定添加排班';
		}
		this.modalTab = true;
	}

	update() {
		this.modalTab = false;
		if(this.changeData._id && this.changeData._id != ''){
			if(this.changeData.value && JSON.parse(this.changeData.value).id != ''){
				//修改
				var params = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					config_id: JSON.parse(this.changeData.value).id,
					config_name: JSON.parse(this.changeData.value).name,
				}
				this.updateScheduling(this.changeData._id, params, 'update');
			}else{
				//删除
				var deleteParams = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					is_delete: 1,
				}
				this.updateScheduling(this.changeData._id, deleteParams, 'delete');
			}
		}else{
			//新增
			var createParams = {
				username: this.adminService.getUser().username,
				token: this.adminService.getUser().token,
				clinic_id: this.adminService.getUser().clinicId,
				admin_id: this.changeData.adminId,
				admin_name: this.changeData.adminName,
				config_id: JSON.parse(this.changeData.value).id,
				config_name: JSON.parse(this.changeData.value).name,
				duty_date: this.changeData.date,
				interval: 30*60,
			}
			this.adminService.adminScheduling(createParams).then((data) => {
				if(data.status == 'no'){
					this.toastTab(data.errorMsg, 'error');
				}else{
					this.toastTab('创建成功', '');
					// this.ngOnInit();
				}
			})
		}
	}

	updateScheduling(_id, params, type){
		this.adminService.updateduty(_id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				if(type == 'update'){
					this.toastTab('修改成功', '');
				}else{
					this.toastTab('删除成功', '');
					// this.ngOnInit();
				}
			}
		});
	}

	close() {
		this.modalTab = false;
		this.ngOnInit();
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