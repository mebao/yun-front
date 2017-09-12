import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-crm-user-list',
	templateUrl: './crm-user-list.component.html',
	styleUrls: ['./crm-user-list.component.scss'],
})
export class CrmUserListComponent{
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
		add: boolean,
		update: boolean,
		delete: boolean,
	}
	hasData: boolean;
	adminlist: any[];
	role: string;
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '后台用户列表',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		// 权限
		this.moduleAuthority = {
			see: false,
			add: false,
			update: false,
			delete: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().clinicRoleId == '0'){
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

		this.adminlist = [];
		this.role = '';
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		this.getData();
	}

	getData() {
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + (this.role == '' ? '' : ('&role=' + this.role));
		this.adminService.adminlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.adminlist = results.adminlist;
				this.hasData = true;
			}
		})
	}

	add() {
		this.router.navigate(['./admin/crmUser'], {queryParams: {type: 'create'}});
	}

	roleChange() {
		this.getData();
	}

	delete(_id) {
		this.selector.id = _id;
		this.selector.text = '确认删除？';
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id
			 + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
		this.adminService.deleteadmin(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('删除成功', '');
				this.getData();
			}
		})
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/crmUser'], {queryParams: {id: _id, type: 'update'}});
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
