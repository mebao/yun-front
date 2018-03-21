import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../../admin.service';

@Component({
	selector: 'app-material-purchase-list',
	templateUrl: './material-purchase-list.component.html',
	styleUrls: ['./material-purchase-list.component.scss'],
})
export class MaterialPurchaseListComponent{
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
		seePut: boolean,
		editPut: boolean,
		infoPut: boolean,
		seeHas: boolean,
		seeLost: boolean,
		seeCheck: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	list: any[];
	url: string;
	info: {
		b_date: string,
		b_date_num: number,
		b_date_text: string,
		l_date: string,
		l_date_num: number,
		l_date_text: string,
		type: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资管理',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		// 权限
		this.moduleAuthority = {
			see: false,
			seePut: false,
			editPut: false,
			infoPut: false,
			seeHas: false,
			seeLost: false,
			seeCheck: false,
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

		if(JSON.parse(sessionStorage.getItem('search-materialPurchaseList'))){
			this.info = JSON.parse(sessionStorage.getItem('search-materialPurchaseList'));
		}else{
			this.info = {
				b_date: '',
				b_date_num: 0,
				b_date_text: '',
				l_date: '',
				l_date_num: 0,
				l_date_text: '',
				type: '3,4',
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	getData(urlOptions) {
		this.adminService.purchaserecords(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].aboutTime = !this.adminService.isFalse(results.list[i].aboutTime) ? this.adminService.dateFormat(results.list[i].aboutTime) : '';
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
		sessionStorage.setItem('search-materialPurchaseList', JSON.stringify(this.info));
		var urlOptions = this.url;
		if(this.info.b_date != ''){
			urlOptions += '&b_date=' + this.info.b_date;
		}
		if(this.info.l_date != ''){
			urlOptions += '&l_date=' + this.info.l_date;
		}
		if(this.info.type != ''){
			urlOptions += '&type=' + this.info.type;
		}
		this.getData(urlOptions);
	}

	// 选择日期
	changeDate(_value, key) {
		this.info[key] = JSON.parse(_value).value;
		this.info[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
		this.info[key + '_text'] = this.adminService.dateFormat(JSON.parse(_value).value);
	}

	goUrl(_url) {
		sessionStorage.removeItem('search-materialList');
		sessionStorage.removeItem('search-materialPurchaseList');
		sessionStorage.removeItem('search-materialHasList');
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/material/purchase'], {queryParams: {id: _id}});
	}

	showInfo(_id) {
		this.router.navigate(['./admin/material/purchaseInfo'], {queryParams: {id: _id, type: this.info.type}});
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
