import { Component, OnInit }               from '@angular/core';
import { Router }                          from '@angular/router';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss']
})
export class MemberListComponent{
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
	memberList: any[];
	hasData: boolean;
	searchInfo: {
		name: string,
		status: string,
	}
	serviceList: any[];

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '会员管理',
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

		this.memberList = [];
		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-memberList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-memberList'));
		}else{
			this.searchInfo = {
				name: '',
				status: '1',
			}
		}

		// 获取诊所科室
		this.serviceList = [];
		this.adminService.servicelist(this.url + '&status=1').then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.serviceList = results.servicelist;
				this.search();
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-memberList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name && this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.status && this.searchInfo.status != ''){
			urlOptions += '&status=' + this.searchInfo.status;
		}
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.memberlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				// 通过诊所科室构造会员折扣
				if(results.list.length > 0){
					for(var i = 0; i < results.list.length; i++){
				// 		var serviceDiscountList = [];
				// 		// 便利诊所科室
				// 		if(this.serviceList.length > 0){
				// 			for(var j = 0; j < this.serviceList.length; j++){
				// 				var serviceDiscount = {
				// 					serviceId: this.serviceList[j].serviceId,
				// 					serviceName: this.serviceList[j].serviceName,
				// 					discount: '',
				// 				};
				// 				// 便利会员下所有科室折扣
				// 				if(results.list[i].services.length > 0){
				// 					for(var k = 0; k < results.list[i].services.length; k++){
				// 						// 通过serviceId,查找discount
				// 						if(results.list[i].services[k].serviceId == this.serviceList[j].serviceId){
				// 							serviceDiscount.discount = results.list[i].services[k].discount;
				// 						}
				// 					}
				// 				}
				// 				serviceDiscountList.push(serviceDiscount);
				// 			}
				// 		}
				// 		results.list[i].serviceDiscountList = serviceDiscountList;
						results.list[i].infoList = [];
						var maxNum = results.list[i].services.length > results.list[i].assists.length ? results.list[i].services.length : results.list[i].assists.length;
						for(var j = 0; j < maxNum; j++){
							var info = {
								serviceId: '',
								serviceName: '',
								serviceDiscount: '',
								assistId: '',
								assistName: '',
								assistDiscount: '',
							}
							if(j < results.list[i].services.length){
								info.serviceId = results.list[i].services[j].serviceId;
								info.serviceName = results.list[i].services[j].serviceName;
								info.serviceDiscount = results.list[i].services[j].discount;
							}
							if(j < results.list[i].assists.length){
								info.assistId = results.list[i].assists[j].assistId;
								info.assistName = results.list[i].assists[j].assistName;
								info.assistDiscount = results.list[i].assists[j].discount;
							}
							if(info.assistDiscount != '' || info.serviceDiscount != ''){
								results.list[i].infoList.push(info);
							}
						}
					}
				}
				this.memberList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
        });
	}

	add() {
		this.router.navigate(['./admin/member']);
	}

	update(member) {
		sessionStorage.setItem('memberInfo', JSON.stringify(member));
		this.router.navigate(['./admin/member'], {queryParams: {id: member.id}});
	}
}
