import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../../admin.service';

@Component({
	selector: 'admin-booking-followups-list',
	templateUrl: './booking-followups-list.component.html',
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
export class BookingFollowupsListComponent{
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
	// 不可连续点击
	btnCanEdit: boolean;

	constructor(
		private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '随访管理',
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

		//随访列表
		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.followupsList = [];
		this.hasData = false;

		if(JSON.parse(sessionStorage.getItem('search-bookingFollowupsList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-bookingFollowupsList'));
		}else{
			this.searchInfo = {
				status: '',
				child_name: '',
				up_user_name: '',
				creator_name: '',
			}
		}

		this.modalConfirmTab = false;
		this.selector = {
			value: '',
			text: '',
		}

		this.loadingShow = false;

		this.search();

		this.btnCanEdit = false;
	}

	searchStatus(_value) {
		this.searchInfo.status = _value;
		this.search();
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-bookingFollowupsList', JSON.stringify(this.searchInfo));
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
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.followupsList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
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
		this.btnCanEdit = true;
		this.modalConfirmTab = false;
		var followups = JSON.parse(this.selector.value);
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			id: followups.id,
			results: ''
		}

		this.adminService.followupresult(followups.id, params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('该随访取消成功');
				this.search();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}

	//宝宝详情
	childInfo(_id) {
		window.open('./admin/child/info?id=' + _id);
	}

	addFollowups() {
		this.router.navigate(['./admin/bookingFollowups'], {queryParams: {
			type: 'create',
			from: 'bookingFollowupsList',
		}});
	}
}
