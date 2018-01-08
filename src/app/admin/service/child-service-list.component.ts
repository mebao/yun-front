import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-child-service-list',
	templateUrl: './child-service-list.component.html'
})
export class ChildServiceListComponent implements OnInit{
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
	loadingShow: boolean;
	childServiceList: any[];
	hasData: boolean;
	status: string;

	constructor(public adminService: AdminService, public router: Router) {}

	ngOnInit(): void {
		this.topBar = {
			title: '宝宝科室列表',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		//权限
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

		this.loadingShow = true;

		this.hasData = false;

		this.childServiceList = [];

		this.status = '1';

		this.getData();
	}

	getData(){
		var servicelistUrl = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&status=' + this.status;
		this.adminService.servicelist(servicelistUrl).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.childServiceList = results.servicelist;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	update(_id){
		this.router.navigate(['./admin/childService'], {queryParams: {id: _id}});
	}

	updateStatus(_id, status){
		var param = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			status: status == 1 ? '0' : '1'
		}
		this.adminService.clinicservicestatus(_id,param).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('状态修改成功', '');
                this.getData();
			}
		})
	}

	goCreate() {
		this.router.navigate(['./admin/childService']);
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
