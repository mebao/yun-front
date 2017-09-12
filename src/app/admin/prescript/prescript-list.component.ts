import { Component, OnInit }                         from '@angular/core';
import { Router }                                    from '@angular/router';

import { AdminService }                              from '../admin.service';

@Component({
	selector: 'app-prescript-list',
	templateUrl: './prescript-list.component.html',
	styleUrls: ['./prescript-list.component.scss'],
})
export class PrescriptListComponent{
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
	list: any[];
	modalConfirmTab: boolean;
	select: {
		id: string,
		text: string,
	}
	url: string;
	searchUrl: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药方列表',
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

		this.list = [];
		this.modalConfirmTab = false;
		this.select = {
			id: '',
			text: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.searchUrl = this.url;

		var urlOptions = this.url;
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.list = results.list;
				this.hasData = true;
			}
		})
	}

	search(f) {
		var urlOptions = this.url;
		if(f.value.isout != ''){
			urlOptions += ('&isout=' + f.value.isout);
		}
		if(f.value.today != ''){
			urlOptions += ('&today=' + f.value.today);
		}
		if(f.value.name != ''){
			urlOptions += ('&name=' + f.value.name);
		}
		if(f.value.doctor_name != ''){
			urlOptions += ('&doctor_name=' + f.value.doctor_name);
		}
		if(f.value.user_name != ''){
			urlOptions += ('&user_name=' + f.value.user_name);
		}
		if(f.value.child_name != ''){
			urlOptions += ('&child_name=' + f.value.child_name);
		}
		this.searchUrl = urlOptions;
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	selectPrescript(_id) {
		this.select.id = _id;
		this.select.text = '确认药品出库';
		this.modalConfirmTab = true;
	}

	confirm() {
		this.modalConfirmTab = false;

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
		}

		this.adminService.outmedicine(this.select.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('药品出库成功', '');
				this.getData(this.searchUrl);
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
