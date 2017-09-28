import { Component, OnInit, HostBinding }             from '@angular/core';
import { NgForm }                                     from '@angular/forms';

import { AdminService }                               from '../admin.service';

@Component({
	selector: 'app-scheduling',
	templateUrl: './scheduling.component.html',
	styleUrls: ['./scheduling.component.scss'],
})
export class SchedulingComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	weektitle: any[];
	schedulinglist: any[];
	weekNum: number;
	url: string;
	schedulingConfigs: any[];
	config: string;
	modalTab: boolean;
	info: string;
	changeData: {
		_id: string,
		value: string,
		adminId: string,
		adminName: string,
		date: string,
	}
	//排班配置
	dutylist: any[];
	dutytime: any[];
	modalConfirmTab: boolean;
	selector: {
		text: string,
	}

	constructor(public adminService: AdminService) {
		this.dutytime = [
			{key: '08:00', value: '08:00'},
			{key: '08:30', value: '08:30'},
			{key: '09:00', value: '09:00'},
			{key: '09:30', value: '09:30'},
			{key: '10:00', value: '10:00'},
			{key: '10:30', value: '10:30'},
			{key: '11:00', value: '11:00'},
			{key: '11:30', value: '11:30'},
			{key: '12:00', value: '12:00'},
			{key: '12:30', value: '12:30'},
			{key: '13:00', value: '13:00'},
			{key: '13:30', value: '13:30'},
			{key: '14:00', value: '14:00'},
			{key: '14:30', value: '14:30'},
			{key: '15:00', value: '15:00'},
			{key: '15:30', value: '15:30'},
			{key: '16:00', value: '16:00'},
			{key: '16:30', value: '16:30'},
			{key: '17:00', value: '17:00'},
			{key: '17:30', value: '17:30'},
			{key: '18:00', value: '18:00'},
			{key: '18:30', value: '18:30'},
			{key: '19:00', value: '19:00'},
			{key: '19:30', value: '19:30'},
			{key: '20:00', value: '20:00'},
			{key: '20:30', value: '20:30'},
			{key: '21:00', value: '21:00'},
			{key: '21:30', value: '21:30'},
			{key: '22:00', value: '22:00'},
			{key: '22:30', value: '22:30'},
			{key: '23:00', value: '23:00'},
			{key: '23:30', value: '23:30'},
		];
		this.dutylist = [{id: 1, use: true}];
	}

	ngOnInit(): void{
		this.topBar = {
			title: '排班',
			back: false,
		}
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

		this.modalConfirmTab = false;
		this.selector = {
			text: '',
		}
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
								date: this.adminService.dateFormat(weekArray[j]),
								title: this.adminService.getWeekTitle(j)
							}
							var scheduling = {
								dutyConfig: '',
								dutyConfigList: [],
								dutyDay: this.adminService.dateFormat(weekArray[j]),
								dutyId: '',
								dutyName: '',
								id: '',
								use: true,
							}
							if(adminduty[i].DutyList.length > 0){
								for(var k = 0; k < adminduty[i].DutyList.length; k++){
									if(weekArray[j] == adminduty[i].DutyList[k].dutyDay){
										scheduling = adminduty[i].DutyList[k];
										scheduling.dutyConfigList = adminduty[i].DutyList[k].dutyConfig.split(' / ');
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

	create(f: NgForm) {
		var dutyDemo = [
			{key: 0, value: '08:00', use: true},
			{key: 1, value: '08:30', use: true},
			{key: 2, value: '09:00', use: true},
			{key: 3, value: '09:30', use: true},
			{key: 4, value: '10:00', use: true},
			{key: 5, value: '10:30', use: true},
			{key: 6, value: '11:00', use: true},
			{key: 7, value: '11:30', use: true},
			{key: 8, value: '12:00', use: true},
			{key: 9, value: '12:30', use: true},
			{key: 10, value: '13:00', use: true},
			{key: 11, value: '13:30', use: true},
			{key: 12, value: '14:00', use: true},
			{key: 13, value: '14:30', use: true},
			{key: 14, value: '15:00', use: true},
			{key: 15, value: '15:30', use: true},
			{key: 16, value: '16:00', use: true},
			{key: 17, value: '16:30', use: true},
			{key: 18, value: '17:00', use: true},
			{key: 19, value: '17:30', use: true},
			{key: 20, value: '18:00', use: true},
			{key: 21, value: '18:30', use: true},
			{key: 22, value: '19:00', use: true},
			{key: 23, value: '19:30', use: true},
			{key: 24, value: '20:00', use: true},
			{key: 25, value: '20:30', use: true},
			{key: 26, value: '21:00', use: true},
			{key: 27, value: '21:30', use: true},
			{key: 28, value: '22:00', use: true},
			{key: 29, value: '22:30', use: true},
			{key: 30, value: '23:00', use: true},
			{key: 31, value: '23:30', use: true},
		]
		//构造时间段
		var dutylist = [];
		var dutyText = '';
		for(var i = 0; i < this.dutylist.length; i++){
			if(this.dutylist[i].use){
				//开始时间未选择
				if(!f.value['duty'+i+'start'] || f.value['duty'+i+'start'] == ''){
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，开始时间不可为空', 'error');
					return;
				}
				//结束时间未选择
				if(!f.value['duty'+i+'end'] || f.value['duty'+i+'end'] == ''){
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，结束时间不可为空', 'error');
					return;
				}
				if(Number(f.value['duty'+i+'end'].split(',')[1]) > Number(f.value['duty'+i+'start'].split(',')[1])){
					var duty = f.value['duty'+i+'start'].split(',')[0] + '-' + f.value['duty'+i+'end'].split(',')[0];
					dutylist.push(duty);
					dutyText += ' ' + duty;
				}else{
					//开始时间早于结束时间
					this.toastTab('第' + (dutylist.length + 1) + '条排班时间，开始时间应晚于结束时间', 'error');
					return;
				}
				//含有重叠时间段
				var start = Number(f.value['duty'+i+'start'].split(',')[1]);
				var end = Number(f.value['duty'+i+'end'].split(',')[1]);
				for(var j = start; j < end; j++){
					var hasBoolean = false;
					for(var k = 0; k < dutyDemo.length; k++){
						if(dutyDemo[k].use && dutyDemo[k].key == j){
							//所选时间，在已有时间中
							hasBoolean = true;
							dutyDemo[k].use = false;
						}
					}
					if(!hasBoolean){
						this.toastTab('时间段存在时间重合，请选择合理的时间段', 'error');
						return;
					}
				}
			}
		}
		this.modalTab = false;
		//设置之前先删除，判断是否可以删除
		if(this.changeData.value != ''){
			this.delete('update', dutylist);
		}else{
			this.configAndScheduling(dutylist);
		}
	}

	//创建判断配置，并排班
	configAndScheduling(dutylist) {
		var dateStr = new Date().getTime();
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			name: dateStr,
			dutylist: dutylist,
			status: '1',
			clinic_id: this.adminService.getUser().clinicId,
		}
		this.adminService.schedulingConfig(param).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				//新增
				var results = JSON.parse(JSON.stringify(data.results));
				var createParams = {
					username: this.adminService.getUser().username,
					token: this.adminService.getUser().token,
					clinic_id: this.adminService.getUser().clinicId,
					admin_id: this.changeData.adminId,
					admin_name: this.changeData.adminName,
					config_id: results.id,
					config_name: dateStr,
					duty_date: this.adminService.dateFormatHasWord(this.changeData.date),
					interval: 30*60,
				}
				this.adminService.adminScheduling(createParams).then((data) => {
					if(data.status == 'no'){
						this.toastTab(data.errorMsg, 'error');
					}else{
						this.toastTab('排班成功', '');
						//清空排班配置
						this.dutylist = [{id: 1, use: true}];
						this.getList(this.url + '&weekindex=' + this.weekNum);
					}
				})
			}
		});
	}

	delete(type, list) {
		this.modalTab = false;
		//删除
		var deleteParams = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			is_delete: 1,
		}
		this.adminService.updateduty(this.changeData._id, deleteParams).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				if(type == 'delete'){
					this.toastTab('删除成功', '');
					//清空排班配置
					this.dutylist = [{id: 1, use: true}];
					this.getList(this.url + '&weekindex=' + this.weekNum);
				}else{
					//删除成功后，添加排班配置并排班
					this.configAndScheduling(list);
				}
			}
		});
	}

	addDuty(index): void {
		const _index = index + 1;
		this.dutylist.push({id: _index, use: true});
	}

	delDuty(id): void{
		for(var i = 0; i < this.dutylist.length; i++){
			if(this.dutylist[i].id == id){
				this.dutylist[i].use = false;
			}
		}
	}

	configChange(use, _id, date, dutyConfig, adminId, adminName) {
		if(use){
			this.changeData = {
				_id: _id,
				value: dutyConfig,
				adminId: adminId,
				adminName: adminName,
				date: date,
			}
			//判断是否已存在排班,并初始化排班配置信息
			if(this.changeData.value != ''){
				var dutyDemo = [
					{key: 0, value: '08:00', use: true},
					{key: 1, value: '08:30', use: true},
					{key: 2, value: '09:00', use: true},
					{key: 3, value: '09:30', use: true},
					{key: 4, value: '10:00', use: true},
					{key: 5, value: '10:30', use: true},
					{key: 6, value: '11:00', use: true},
					{key: 7, value: '11:30', use: true},
					{key: 8, value: '12:00', use: true},
					{key: 9, value: '12:30', use: true},
					{key: 10, value: '13:00', use: true},
					{key: 11, value: '13:30', use: true},
					{key: 12, value: '14:00', use: true},
					{key: 13, value: '14:30', use: true},
					{key: 14, value: '15:00', use: true},
					{key: 15, value: '15:30', use: true},
					{key: 16, value: '16:00', use: true},
					{key: 17, value: '16:30', use: true},
					{key: 18, value: '17:00', use: true},
					{key: 19, value: '17:30', use: true},
					{key: 20, value: '18:00', use: true},
					{key: 21, value: '18:30', use: true},
					{key: 22, value: '19:00', use: true},
					{key: 23, value: '19:30', use: true},
					{key: 24, value: '20:00', use: true},
					{key: 25, value: '20:30', use: true},
					{key: 26, value: '21:00', use: true},
					{key: 27, value: '21:30', use: true},
					{key: 28, value: '22:00', use: true},
					{key: 29, value: '22:30', use: true},
					{key: 30, value: '23:00', use: true},
					{key: 31, value: '23:30', use: true},
					{key: 32, value: '00:00', use: true},
				]
				//清空排班配置
				this.dutylist = [];
				//构造已存在排班配置
				var hasScheduling = this.changeData.value.split(' / ');
				if(hasScheduling.length > 0){
					for(var i = 0; i < hasScheduling.length; i++){
						var start = hasScheduling[i].split('-')[0];
						var end = hasScheduling[i].split('-')[1];
						var duty = {
							id: i + 1,
							start: '',
							end: '',
							use: true,
						}
						for(var j = 0; j < dutyDemo.length; j++){
							if(start == dutyDemo[j].value){
								duty.start = start + ',' + dutyDemo[j].key;
							}
							if(end == dutyDemo[j].value){
								duty.end = end + ',' + dutyDemo[j].key;
							}
						}
						this.dutylist.push(duty);
					}
				}
			}else{
				//清空排班配置
				this.dutylist = [{id: 1, use: true}];
			}

			this.modalTab = true;
		}
	}

	close() {
		this.modalTab = false;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	copyPrec() {
		this.modalConfirmTab = true;
		this.selector.text = '确认复制上周排版？';
	}

	confirm() {
		this.modalConfirmTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			lastindex: this.weekNum - 1,
			nextindex: this.weekNum,
		}

		this.adminService.copyduty(this.adminService.getUser().clinicId, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('复制排版成功', '');
				this.getList(this.url + '&weekindex=' + this.weekNum);
			}
		});
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
