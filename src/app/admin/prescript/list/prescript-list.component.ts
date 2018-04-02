import { Component, OnInit }                         from '@angular/core';
import { Router }                                    from '@angular/router';

import { AdminService }                              from '../../admin.service';

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
		seeBack: boolean,
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
		isout: string,
		today: string,
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
			edit: false,
			seeBack: false,
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

		this.loadingShow = false;

		this.hasData = false;

		this.list = [];
		this.modalConfirmTab = false;
		this.select = {
			id: '',
			text: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId
			 + '&isout=1';

 		this.searchInfo = {
 			isout: '',
 			today: '',
 			doctor_name: '',
 			user_name: '',
 			child_name: '',
 		}

		this.search();
	}

	getData(urlOptions) {
		this.adminService.searchprescript(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var prescriptList = [];
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						if(this.searchInfo.isout == '1' || (this.searchInfo.isout == '' && results.list[i].outCode != 0)){
							results.list[i].infoLength = results.list[i].info.length;
							if(results.list[i].info.length > 0){
								for(var j = 0; j < results.list[i].info.length; j++){
									results.list[i].info[j].msExplain = '单次：' + parseFloat(results.list[i].info[j].oneNum) + results.list[i].info[j].oneUnit + '，' + results.list[i].info[j].frequency + '，' + results.list[i].info[j].usage + '，共' + results.list[i].info[j].days + '天' + (results.list[i].info[j].remark != '' ? '，' + results.list[i].info[j].remark : '');
								}
							}
							prescriptList.push(results.list[i]);
						}
					}
				}
				this.list = prescriptList;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	search() {
		this.loadingShow = true;
		var urlOptions = this.url;
		// if(this.searchInfo.isout != ''){
		// 	urlOptions += ('&isout=' + this.searchInfo.isout);
		// }
		if(this.searchInfo.today != ''){
			urlOptions += ('&today=' + this.searchInfo.today);
		}
		// if(f.value.name != ''){
		// 	urlOptions += ('&name=' + f.value.name);
		// }
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
