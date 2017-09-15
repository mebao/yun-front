import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'admin-booking-followups-list',
	templateUrl: './booking-followups-list.component.html',
})
export class BookingFollowupsListComponent{
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
	followupsList: any[];
	hasData: boolean;
	searchInfo: {
		status: string,
		child_name: string,
		up_user_name: string,
		creator_name: string,
	}
	modalConfirmTab: boolean;
	selector: {
		value: string,
		text: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '随访管理',
			back: false,
		}
		this.toast = {
			show: 0,
			text: '',
			type:  '',
		};

		this.moduleAuthority = {
			see: false,
			edit: false,
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

		//随访列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.followupsList = [];
		this.hasData = false;

		this.searchInfo = {
			status: '',
			child_name: '',
			up_user_name: '',
			creator_name: '',
		}

		this.modalConfirmTab = false;
		this.selector = {
			value: '',
			text: '',
		}

		this.search();
	}

	searchStatus(_value) {
		this.searchInfo.status = _value;
		this.search();
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.status != ''){
			urlOptions += '&status=' + this.searchInfo.status;
		}
		if(this.searchInfo.child_name != ''){
			urlOptions += '&child_name=' + this.searchInfo.child_name;
		}
		if(this.searchInfo.up_user_name != ''){
			urlOptions += '&up_user_name=' + this.searchInfo.up_user_name;
		}
		if(this.searchInfo.creator_name != ''){
			urlOptions += '&creator_name=' + this.searchInfo.creator_name;
		}

		this.getData(urlOptions);
	}

	getData(urlOptions) {
		this.adminService.userfollowups(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.followupsList = results.list;
				this.hasData = true;
			}
		});
	}

	update(followups) {
		sessionStorage.setItem('followups', JSON.stringify(followups));
		this.router.navigate(['./admin/bookingFollowups'], {queryParams: {id: followups.bookingid, doctorId: followups.creatorId, type: 'update', followupsId: followups.id}});
	}

	cancel(followups) {
		this.selector = {
			value: JSON.stringify(followups),
			text: '确定删除该随访？',
		}
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		var followups = JSON.parse(this.selector.value);
		this.modalConfirmTab = false;
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: followups.id,
			results: ''
		}

		this.adminService.followupresult(followups.id, params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('该随访取消成功', '');
				this.search();
			}
		});
	}

	//小孩详情
	childInfo(_id) {
		window.open('./admin/childInfo?id=' + _id);
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
