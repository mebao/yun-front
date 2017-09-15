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
		seeCheck: boolean,
		editCheck: boolean,
	}
	url: string;
	stockList: any[];
	hasData: boolean;
	info: {
		name: string,
		type: string,
		b_time: string,
		l_time: string,
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
			seeCheck: false,
			editCheck: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().role == '0'){
			for(var key in this.moduleAuthority){
				this.moduleAuthority[key] = true;
			}
		}else{
			var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
			for(var i = 0; i < authority.infos.length; i++){
				this.moduleAuthority[authority.infos[i].keyName] = true;
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.info = {
			name: '',
			type: '3',
			b_time: '',
			l_time: '',
		}

		this.stockList = [];
		this.hasData = false;
		this.search();
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	add() {
		this.router.navigate(['./admin/materialCheck']);
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

	getData(urlOptions) {
		this.adminService.searchstock(urlOptions).then((data) => {
			if(data.status == 'no'){
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
			}
		});
	}

	update(material) {
		sessionStorage.setItem('materialCheck', JSON.stringify(material));
		this.router.navigate(['./admin/materialCheck'], {queryParams: {id: material.id}});
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
