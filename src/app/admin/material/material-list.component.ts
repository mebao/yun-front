import { Component, OnInit }                   from '@angular/core';
import { Router }                              from '@angular/router';

import { AdminService }                        from '../admin.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
	selector: 'app-material-list',
	templateUrl: './material-list.component.html',
    styleUrls: ['../../../assets/css/ant-common.scss'],
})
export class MaterialListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
		seePut: boolean,
		seeHas: boolean,
		seeLost: boolean,
		seeCheck: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	url: string;
	materialSupplies: any[];
	serachInfo: {
		name: string,
		type: string,
	};

	constructor(
    private message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '物资管理',
			back: false,
		}

		// 权限
		this.moduleAuthority = {
			see: false,
			edit: false,
			seePut: false,
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

		this.loadingShow = false;
		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-materialList'))){
			this.serachInfo = JSON.parse(sessionStorage.getItem('search-materialList'));
		}else{
			this.serachInfo = {
				name: '',
				type: '3,4',
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.materialSupplies = [];

		this.search();
	}

	getData(urlOptions) {
		this.adminService.medicalsupplieslist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
        this.message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.materialSupplies = results.medicalSupplies;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
      this.message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-materialList', JSON.stringify(this.serachInfo));
		var urlOptions = this.url;
		if(this.serachInfo.name != ''){
			urlOptions += '&name=' + this.serachInfo.name;
		}
		if(this.serachInfo.type != ''){
			urlOptions += '&type=' + this.serachInfo.type;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
        this.loadingShow = true;
		sessionStorage.removeItem('search-materialPurchaseList');
		sessionStorage.removeItem('search-materialHasList');
		sessionStorage.removeItem('search-materialLostList');
		sessionStorage.removeItem('search-materialCheckList');
		this.router.navigate([_url]);
	}

	goCreate() {
		this.router.navigate(['./admin/material/index']);
	}

	update(_id) {
		this.router.navigate(['./admin/material/index'], {queryParams: {id: _id}});
	}
}
