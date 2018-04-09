import { Component, OnInit }                    from '@angular/core';
import { Router, ActivatedRoute }               from '@angular/router';

import { NzMessageService }                     from 'ng-zorro-antd';

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
	// 权限
	moduleAuthority: {
		see: boolean,
		service: boolean,
		scheduling: boolean,
		personal: boolean,
	};
	loadingShow: boolean;
	doctorlist: any[];
	hasData: boolean;

	constructor(
        private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '医生列表',
			back: false,
		}

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

		this.loadingShow = true;

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
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
			 	var results = JSON.parse(JSON.stringify(data.results));
				this.doctorlist = results.adminlist;
			 	this.hasData = true;
				this.loadingShow = false;
			}
		}).catch((error) => {
			this.loadingShow = false;
			this._message.error('服务器错误');
		});
	}

	showService(_id) {
		this.router.navigate(['./admin/doctor/serviceList'], {queryParams: {'id': _id}});
	}

	showInfo(_id){
		this.router.navigate(['./admin/doctor/info'], {queryParams: {'id': _id}});
	}

	// 儿保记录模板
	showRecordTempletList(_id) {
		this.router.navigate(['./admin/doctor/recordTempletList'], {queryParams: {'id': _id}});
	}

	// 病历模板
	showCaseTempletList(_id) {
		this.router.navigate(['./admin/doctor/caseTempletList'], {queryParams: {'id': _id}});
	}
}
