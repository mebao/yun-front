import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../../admin.service';
import { config }                                from '../../../config';

@Component({
	selector: 'app-material-has-list',
	templateUrl: './material-has-list.component.html',
})
export class MaterialHasListComponent{
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
		seeHas: boolean,
		editHas: boolean,
		seeLost: boolean,
		seeCheck: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	list: any[];
	url: string;
	info: {
		name: string,
		type: string,
		l_stock: string,
		b_stock: string,
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

		this.moduleAuthority = {
			see: false,
			seePut: false,
			seeHas: false,
			editHas: false,
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

		this.loadingShow = false;

		this.hasData = false;

		this.list = [];

		if(JSON.parse(sessionStorage.getItem('search-materialHasList'))){
			this.info = JSON.parse(sessionStorage.getItem('search-materialHasList'));
		}else{
			this.info = {
				name: '',
				type: '3,4',
				l_stock: '',
				b_stock: '',
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	getData(urlOptions) {
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						if(results.list[i].others.length){
							for(var j = 0; j < results.list[i].others.length; j++){
								results.list[i].others[j].expiringDate = results.list[i].others[j].expiringDate ? this.adminService.dateFormat(results.list[i].others[j].expiringDate) : '';
							}
						}
					}
				}
				this.list = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		})
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-materialHasList', JSON.stringify(this.info));
		var urlOptions = this.url;
		if(this.info.name != ''){
			urlOptions += '&name=' + this.info.name;
		}
		if(this.info.type != ''){
			urlOptions += '&type=' + this.info.type;
		}
		if(this.info.l_stock && this.info.l_stock != ''){
			urlOptions += '&l_stock=' + this.info.l_stock;
		}
		if(this.info.b_stock && this.info.b_stock != ''){
			urlOptions += '&b_stock=' + this.info.b_stock;
		}
		this.getData(urlOptions);
	}

	export() {
		var urlOptions=this.url;
		urlOptions += '&stockType=2';
		if(this.info.name != ''){
			urlOptions += '&name=' + this.info.name;
		}
		if(this.info.type != ''){
			urlOptions += '&type=' + this.info.type;
		}
		if(this.info.l_stock && this.info.l_stock != ''){
			urlOptions += '&l_stock=' + this.info.l_stock;
		}
		if(this.info.b_stock && this.info.b_stock != ''){
			urlOptions += '&b_stock=' + this.info.b_stock;
		}
		window.location.href = config.baseHTTP + '/mebcrm/stockexport'+ urlOptions;
	}

	goUrl(_url) {
		sessionStorage.removeItem('search-materialList');
		sessionStorage.removeItem('search-materialPurchaseList');
		sessionStorage.removeItem('search-materialLostList');
		sessionStorage.removeItem('search-materialCheckList');
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/material/has'], {queryParams: {id: _id}});
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