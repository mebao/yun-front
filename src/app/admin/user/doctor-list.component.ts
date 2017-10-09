import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { AdminService }                         from '../admin.service';

@Component({
	selector:'app-doctor-list',
	templateUrl: 'doctor-list.component.html',
	styleUrls: ['./doctor-list.component.scss'],
})
export class DoctorListComponent implements OnInit{
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
		service: boolean,
		scheduling: boolean,
		personal: boolean,
	};
	doctorlist: any[];
	hasData: boolean;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医生列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		// 权限
		this.moduleAuthority = {
			see: false,
			service: false,
			scheduling: false,
			personal: false,
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

		this.hasData = false;

		this.doctorlist = [];

		//查询医生信息
		var adminServiceUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&role=2';
		if(this.moduleAuthority.personal && !this.moduleAuthority.see){
			adminServiceUrl += '&myself=1';
		}
		this.adminService.adminlist(adminServiceUrl).then((data) => {
			 if(data.status == 'no'){
			 	this.toastTab(data.errorMsg, 'error');
			 }else{
			 	var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
			 	this.hasData = true;
			 }
		})
	}

	showService(_id) {
		this.router.navigate(['./admin/doctorServiceList'], {queryParams: {'id': _id}});
	}

	showInfo(_id){
		this.router.navigate(['./admin/doctorInfo'], {queryParams: {'id': _id}});
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
