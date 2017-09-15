import { Component, OnInit }                     from '@angular/core';
import { Router }                                from '@angular/router';

import { AdminService }                          from '../admin.service';

@Component({
	selector: 'app-medical-has-list',
	templateUrl: './medical-has-list.component.html',
})
export class MedicalHasListComponent{
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
		seeHas: boolean,
		editHas: boolean,
	}
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
			title: '药房管理',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.moduleAuthority = {
			seeHas: false,
			editHas: false,
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

		this.hasData = false;

		this.list = [];
		this.info = {
			name: '',
			type: '1',
			l_stock: '',
			b_stock: '',
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.search();
	}

	getData(urlOptions) {
		this.adminService.searchsupplies(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.list = results.list;
				this.hasData = true;
			}
		})
	}

	search() {
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

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/medicalHas'], {queryParams: {id: _id}});
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
