import { Component, OnInit }                     from '@angular/core';
import { Router, ActivatedRoute }                from '@angular/router';

import { AdminService }                          from '../admin.service';

import { ToastService }                          from '../../common/nll-toast/toast.service';
import { ToastConfig, ToastType }                from '../../common/nll-toast/toast-model';

@Component({
	selector: 'app-child-service-list',
	templateUrl: './child-service-list.component.html'
})
export class ChildServiceListComponent implements OnInit{
	topBar: {
		title: string,
		back: boolean,
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

	constructor(
		public adminService: AdminService,
		public router: Router,
		private toastService: ToastService,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '宝宝科室列表',
			back: false,
		}

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
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
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
				const toastCfg = new ToastConfig(ToastType.ERROR, '', data.errorMsg, 3000);
				this.toastService.toast(toastCfg);
			}else{
				const toastCfg = new ToastConfig(ToastType.SUCCESS, '', '状态修改成功', 3000);
				this.toastService.toast(toastCfg);
                this.getData();
			}
		})
	}

	goCreate() {
		this.router.navigate(['./admin/childService']);
	}
}
