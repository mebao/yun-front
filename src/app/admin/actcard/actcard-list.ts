import { Component, OnInit }               from '@angular/core';
import { Router }                          from '@angular/router';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'app-actcard-list',
	templateUrl: './actcard-list.html',
	styles: [ `
		.ant-form-item-label label:after{
		    display: none;
		}
	`
  	]
})
export class ActcardList{
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
	url: string;
	actcardList: any[];
	hasData: boolean;
	searchInfo: {
		name: string,
	}

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '活动卡管理',
			back: false,
		}

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

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.actcardList = [];
		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-actcardList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-actcardList'));
		}else{
			this.searchInfo = {
				name: '',
			}
		}
        this.search();
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-actcardList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name && this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.searchactcard(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.actcardList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
            this.loadingShow = false;
            this._message.error('服务器错误');
        })
	}

	add() {
		this.router.navigate(['./admin/actcard']);
	}

	update(actcard) {
		this.router.navigate(['./admin/actcard'], {queryParams: {id: actcard.id}});
	}
}
