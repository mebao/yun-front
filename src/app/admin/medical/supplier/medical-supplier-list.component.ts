import { Component, OnInit }                      from '@angular/core';
import { Router, ActivatedRoute }                 from '@angular/router';

import { NzMessageService }                       from 'ng-zorro-antd';

import { AdminService }                           from '../../admin.service';

@Component({
	selector: 'app-medical-supplier-list',
	templateUrl: './medical-supplier-list.component.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
		.ant-form-item{
			margin-bottom: 0;
		}
	`
  	]
})
export class MedicalSupplierListComponent{
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
	hasData: boolean;
	url: string;
	list: any[];
	info: {
		name: string,
		company: string,
	}

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '供应商管理',
			back: false,
		}

		// 权限
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

		this.loadingShow = false;

		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-supplierList'))){
			this.info = JSON.parse(sessionStorage.getItem('search-supplierList'));
		}else{
			this.info = {
				name: '',
				company: '',
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.list = [];

		this.search();
	}

	getData(urlOptions) {
		this.adminService.supplierlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.list = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-supplierList', JSON.stringify(this.info));
		var urlOptions = this.url;
		if(this.info.name != ''){
			urlOptions += '&name=' + this.info.name;
		}
		if(this.info.company != ''){
			urlOptions += '&company=' + this.info.company;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	goCreate() {
		this.router.navigate(['./admin/medical/supplier']);
	}

	update(_id) {
		this.router.navigate(['./admin/medical/supplier'], {queryParams: {id: _id}});
	}
}
