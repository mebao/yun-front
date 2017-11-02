import { Component, OnInit }                         from '@angular/core';
import { Router }                                    from '@angular/router';

import { AdminService }                              from '../admin.service';

@Component({
	selector: 'app-prescript-back-list',
	templateUrl: './prescript-back-list.component.html',
	styleUrls: ['./prescript-back-list.component.scss'],
})
export class PrescriptBackListComponent{
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
		seeBack: boolean,
		editBack: boolean,
		seeSale: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	list: any[];
	modalConfirmTab: boolean;
	select: {
		id: string,
		text: string,
	}
	url: string;
	searchUrl: string;
	searchInfo: {
		is_back: string,
		doctor_name: string,
		user_name: string,
		child_name: string,
	}

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
			seeBack: false,
			editBack: false,
			seeSale: false,
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

		this.list = [];
		this.modalConfirmTab = false;
		this.select = {
			id: '',
			text: '',
		}

		this.searchInfo = {
			is_back: '1',
			doctor_name: '',
			user_name: '',
			child_name: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.searchUrl = this.url;

		var urlOptions = this.url;
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchbackdrug(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].infoLength = results.list[i].info.length;
					}
				}
				this.list = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.is_back != ''){
			urlOptions += ('&is_back=' + this.searchInfo.is_back);
		}
		if(this.searchInfo.doctor_name != ''){
			urlOptions += ('&doctor_name=' + this.searchInfo.doctor_name);
		}
		if(this.searchInfo.user_name != ''){
			urlOptions += ('&user_name=' + this.searchInfo.user_name);
		}
		if(this.searchInfo.child_name != ''){
			urlOptions += ('&child_name=' + this.searchInfo.child_name);
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
		this.select.text = '确认药品已退药？';
		this.modalConfirmTab = true;
	}

	confirm() {
		this.modalConfirmTab = false;

		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
		}

		this.adminService.backdrug(this.select.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('药品退药成功', '');
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
