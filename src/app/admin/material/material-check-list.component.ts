import { Component }                       from '@angular/core';
import { Router }                          from '@angular/router';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-material-check-list',
	templateUrl: './material-check-list.component.html'
})
export class MaterialCheckListComponent{
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
		seeLost: boolean,
		seeCheck: boolean,
		addCheck: boolean,
	}
	loadingShow: boolean;
	url: string;
	stockList: any[];
	hasData: boolean;
	info: {
		name: string,
		type: string,
		b_time: string,
		b_time_num: number,
		l_time: string,
		l_time_num: number,
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
			seeLost: false,
			seeCheck: false,
			addCheck: false,
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

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.info = {
			name: '',
			type: '3,4',
			b_time: '',
			b_time_num: 0,
			l_time: '',
			l_time_num: 0,
		}

		this.stockList = [];
		this.hasData = false;
		this.search();
	}

	goUrl(_url) {
		sessionStorage.removeItem('search-materialList');
		sessionStorage.removeItem('search-materialPurchaseList');
		sessionStorage.removeItem('search-materialHasList');
		this.router.navigate([_url]);
	}

	add() {
		this.router.navigate(['./admin/material/check']);
	}

	search() {
		var urlOptions = this.url;
		if(this.info.name != ''){
			urlOptions += '&name=' + this.info.name;
		}
		if(this.info.type != ''){
			urlOptions += '&type=' + this.info.type;
		}
		if(this.info.b_time != ''){
			urlOptions += '&b_time=' + this.info.b_time;
		}
		if(this.info.l_time != ''){
			urlOptions += '&l_time=' + this.info.l_time;
		}
		this.getData(urlOptions);
	}

	// 选择日期
	changeDate(_value, key) {
		this.info[key] = JSON.parse(_value).value;
		this.info[key + '_num'] = new Date(JSON.parse(_value).value).getTime();
	}

	getData(urlOptions) {
		this.adminService.searchstock(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
						results.list[i].deviation = Number(results.list[i].realityStock) - Number(results.list[i].stock);
					}
				}
				this.stockList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		});
	}

	update(material) {
		sessionStorage.setItem('materialCheck', JSON.stringify(material));
		this.router.navigate(['./admin/material/check'], {queryParams: {id: material.id}});
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
