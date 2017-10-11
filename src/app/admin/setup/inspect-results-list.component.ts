import { Component, OnInit }                      from '@angular/core';
import { Router }                                 from '@angular/router';

import { AdminService }                           from '../admin.service';

@Component({
	selector: 'admin-inspect-results-list',
	templateUrl: './inspect-results-list.component.html',
})
export class InspectResultsListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
	}
	hasData: boolean;
	userCheckList: any[];
	checkProjestList: any[];
	info: {
		check_name: string,
		doctor_name: string,
		child_name: string,
		ischeck: string,
		today: string,
	}
	url: string;

	constructor(
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目列表',
			back: false,
		}

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.info = {
			check_name: '',
			doctor_name: '',
			child_name: '',
			ischeck: '',
			today: '',
		}

		this.hasData = false;
		this.userCheckList = [];
		this.checkProjestList = [];

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.adminService.checkprojects(this.url).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.checkProjestList = results.list;
			}
		});
		this.search();
	}

	getData(urlOptions) {
		this.adminService.usercheckprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.userCheckList = results.list;
				this.hasData = true;
			}
		});
	}

	search() {
		var urlOptions = this.url;
		if(this.info.check_name != ''){
			urlOptions += '&check_name=' + this.info.check_name;
		}
		if(this.info.doctor_name != ''){
			urlOptions += '&doctor_name=' + this.info.doctor_name;
		}
		if(this.info.child_name != ''){
			urlOptions += '&child_name=' + this.info.child_name;
		}
		if(this.info.ischeck != ''){
			urlOptions += '&ischeck=' + this.info.ischeck;
		}
		if(this.info.today != ''){
			urlOptions += '&today=' + this.info.today;
		}
		this.getData(urlOptions);
	}

	check(_id) {
		this.router.navigate(['./admin/inspectResults'], {queryParams: {id: _id}});
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/childInfo?id=' + _id);
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
