import { Component, OnInit }                   from '@angular/core';
import { Router }                              from '@angular/router';

import { AdminService }                        from '../admin.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
	selector: 'app-medicalsupplies-list',
	templateUrl: './medical-list.component.html',
  styleUrls: ['../../../assets/css/ant-common.scss'],
})
export class MedicalListComponent{
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
	medicalSupplies: any[];
	searchInfo: {
		name: string,
		type: string,
	}

	constructor(
    private message: NzMessageService,
    public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '药房管理',
			back: false,
		}

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

		if(JSON.parse(sessionStorage.getItem('search-medicalList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-medicalList'));
		}else{
			this.searchInfo = {
				name: '',
				type: '1,2',
			}
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.medicalSupplies = [];

		this.search();
	}

	getData(urlOptions) {
		this.adminService.medicalsupplieslist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
        this.message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.medicalSupplies = results.medicalSupplies;
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
		sessionStorage.setItem('search-medicalList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.type != ''){
			urlOptions += '&type=' + this.searchInfo.type;
		}
		this.getData(urlOptions);
	}

	goUrl(_url) {
        this.loadingShow = true;
		sessionStorage.removeItem('search-medicalPurchaseList');
		sessionStorage.removeItem('search-medicalHasList');
		sessionStorage.removeItem('search-medicalLostList');
		sessionStorage.removeItem('search-medicalCheckList');
		this.router.navigate([_url]);
	}

	goCreate() {
		this.router.navigate(['./admin/medical/index']);
	}

	update(_id) {
		this.router.navigate(['./admin/medical/index'], {queryParams: {id: _id}});
	}
}
