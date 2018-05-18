import { Component, OnInit }               from '@angular/core';
import { Router }                          from '@angular/router';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-mout-list',
	templateUrl: './mout-list.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class MoutList{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
	}
	url: string;
	loadingShow: boolean;
	hasData: boolean;
	moutList: any[];
	searchInfo: {
		name: string,
		startDate: Date,
		endDate: Date,
	}

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '手动出库管理',
			back: false,
		}

		this.moduleAuthority = {
			see: true,
			edit: true,
		}
		// // 那段角色，是超级管理员0还是普通角色
		// // 如果是超级管理员，获取所有权限
		// if(this.adminService.getUser().role == '0' || this.adminService.getUser().role == '9'){
		// 	for(var key in this.moduleAuthority){
		// 		this.moduleAuthority[key] = true;
		// 	}
		// }else{
		// 	var authority = JSON.parse(sessionStorage.getItem('userClinicRolesInfos'));
		// 	for(var i = 0; i < authority.infos.length; i++){
		// 		this.moduleAuthority[authority.infos[i].keyName] = true;
		// 	}
		// }

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.loadingShow = false;

		this.hasData = false;
		this.moutList = [];

		var sessionSearch = JSON.parse(sessionStorage.getItem('search-moutList'));
		if(sessionSearch){
			this.searchInfo = {
				name: sessionSearch.name,
				startDate: new Date(sessionSearch.startDate),
				endDate: new Date(sessionSearch.endDate),
			}
		}else{
			this.searchInfo = {
				name: '',
				startDate: new Date(),
				endDate: new Date(),
			}
		}

		this.search();
	}

	getData(urlOptions) {
		this.adminService.searchdelivery(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.moutList = results.list;
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
		sessionStorage.setItem('search-moutList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name && this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
        if(this.searchInfo.startDate){
            urlOptions += '&bdate_big=' + this.adminService.getDayByDate(new Date(this.searchInfo.startDate));
        }
        if(this.searchInfo.endDate){
            urlOptions += '&bdate_less=' + this.adminService.getDayByDate(new Date(this.searchInfo.endDate));
        }
		this.getData(urlOptions);
	}

    _disabledStartDate = (startValue) => {
        if (!startValue || !this.searchInfo.endDate) {
            return false;
        }
        return startValue.getTime() > this.searchInfo.endDate.getTime();
    };

    _disabledEndDate = (endValue) => {
        if (!endValue || !this.searchInfo.startDate) {
            return false;
        }
        return endValue.getTime() < this.searchInfo.startDate.getTime();
    };

	add() {
		this.router.navigate(['./admin/mout']);
	}
}
