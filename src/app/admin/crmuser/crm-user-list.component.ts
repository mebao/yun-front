import { Component, OnInit }                  from '@angular/core';
import { Router }                             from '@angular/router';

import { NzMessageService }                   from 'ng-zorro-antd';

import { AdminService }                       from '../admin.service';

@Component({
	selector: 'app-crm-user-list',
	templateUrl: './crm-user-list.component.html',
	styleUrls: ['../../../assets/css/ant-common.scss'],
})
export class CrmUserListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		add: boolean,
		update: boolean,
		delete: boolean,
	}
	loadingShow: boolean;
	hasData: boolean;
	adminlist: any[];
	modalConfirmTab: boolean;
	selector: {
		id: string,
		text: string,
	}
	url: string;
	clinicRoleList: any[];
	searchInfo: {
		name: string,
		mobile: string,
		role: string,
		clinic_role: string,
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
			title: '员工列表',
			back: false,
		}

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		// 权限
		this.moduleAuthority = {
			see: false,
			add: false,
			update: false,
			delete: false,
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

		this.adminlist = [];
		this.modalConfirmTab = false;
		this.selector = {
			id: '',
			text: '',
		}

		if(JSON.parse(sessionStorage.getItem('search-crmuserList'))){
			this.searchInfo = JSON.parse(sessionStorage.getItem('search-crmuserList'));
		}else{
			this.searchInfo = {
				name: '',
				mobile: '',
				role: '',
				clinic_role: '',
			}
		}

		this.search();

		//获取角色列表
		this.clinicRoleList = [];
		var clinicroleUrl = this.url + '&status=1';
		this.adminService.clinicrolelist(clinicroleUrl).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.clinicRoleList = results.list;
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });

		this.btnCanEdit = false;
	}

	getData(urlOptions) {
		this.adminService.adminlist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.adminlist = results.adminlist;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
        });
	}

	add() {
		this.router.navigate(['./admin/crmuser'], {queryParams: {type: 'create'}});
	}

	search() {
		this.loadingShow = true;
		sessionStorage.setItem('search-crmuserList', JSON.stringify(this.searchInfo));
		var urlOptions = this.url;
		if(this.searchInfo.name && this.searchInfo.name != ''){
			urlOptions += '&name=' + this.searchInfo.name;
		}
		if(this.searchInfo.mobile && this.searchInfo.mobile != ''){
			urlOptions += '&mobile=' + this.searchInfo.mobile;
		}
		if(this.searchInfo.role && this.searchInfo.role != ''){
			urlOptions += '&role=' + this.searchInfo.role;
		}
		if(this.searchInfo.clinic_role && this.searchInfo.clinic_role != ''){
			urlOptions += '&clinic_role_id=' + this.searchInfo.clinic_role;
		}
		this.getData(urlOptions);
	}

	delete(_id) {
		this.selector.id = _id;
		this.selector.text = '确认删除？';
		this.modalConfirmTab = true;
	}

	closeConfirm() {
		this.modalConfirmTab = false;
	}

	confirm() {
		this.btnCanEdit = true;
		this.modalConfirmTab = false;
		var urlOptions = this.selector.id
			 + '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
		this.adminService.deleteadmin(urlOptions).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
				this.btnCanEdit = false;
			}else{
				this._message.success('删除成功');
				this.search();
				this.btnCanEdit = false;
			}
		}).catch(() => {
			this._message.error('服务器错误');
			this.btnCanEdit = false;
        });
	}

	goUrl(_url) {
		this.router.navigate([_url]);
	}

	update(_id) {
		this.router.navigate(['./admin/crmuser'], {queryParams: {id: _id, type: 'update'}});
	}
}
