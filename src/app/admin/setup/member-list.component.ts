import { Component, OnInit }               from '@angular/core';
import { Router }                          from '@angular/router';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-member-list',
	templateUrl: './member-list.component.html',
})
export class MemberListComponent{
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
		edit: boolean,
	}
	url: string;
	memberList: any[];
	hasData: boolean;
	searchInfo: {
		name: string,
		status: string,
	}

	constructor(
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '会员管理',
			back: true,
		}

		this.toast = {
			show: 0,
			text: '',
			type: '',
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
		}
		// 那段角色，是超级管理员0还是普通角色
		// 如果是超级管理员，获取所有权限
		if(this.adminService.getUser().clinicRoleId == '0'){
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

		this.memberList = [];
		this.hasData = false;

		this.searchInfo = {
			name: '',
			status: '',
		}

		this.search();
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.status != ''){
			urlOptions += '&status=' + this.searchInfo.status;
		}
		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.memberlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.memberList = results.list;
				this.hasData = true;
			}
		});
	}

	add() {
		this.router.navigate(['./admin/member']);
	}

	update(member) {
		sessionStorage.setItem('memberInfo', JSON.stringify(member));
		this.router.navigate(['./admin/member'], {queryParams: {id: member.id}});
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
