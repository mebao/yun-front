import { Component }                         from '@angular/core';
import { Router }                            from '@angular/router';

import { NzMessageService }                  from 'ng-zorro-antd';

import { AdminService }                      from '../../admin.service';

@Component({
	selector: 'admin-crm-role-list',
	templateUrl: './crm-role-list.component.html',
	styleUrls: ['../../../../assets/css/ant-common.scss']
})
export class CrmRoleListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	// 权限
	moduleAuthority: {
		see: boolean,
		edit: boolean,
		authority: boolean,
	}
	loadingShow: boolean;
	roleList: any[];
	hasData: boolean;
	url: string;
	searchInfo: {
		status: string,
	}

	constructor(
        private _message: NzMessageService,
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '角色管理',
			back: false,
		}

		this.moduleAuthority = {
			see: false,
			edit: false,
			authority: false,
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

		this.roleList = [];
		this.hasData = false;

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.searchInfo = {
			status: '1'
		}

		this.search();
	}

	search() {
		this.loadingShow = true;
		var urlOptions = this.url;
		if(this.searchInfo.status !== null && this.searchInfo.status !== ''){
			urlOptions += '&status=' + this.searchInfo.status;
		}
		this.getData(urlOptions);
	}

	updateStatus(role) {
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			status: role.status == '1' ? '0' : '1',
		}

		this.adminService.clinicrole('/' + role.id, params).then((data) => {
			if(data.status == 'no'){
				this._message.error(data.errorMsg);
			}else{
				this._message.success('状态修改成功');
				this.search();
			}
		}).catch(() => {
            this._message.error('服务器错误');
        });
	}

	getData(urlOptions) {
		this.adminService.clinicrolelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.roleList = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
			this._message.error('服务器错误');
        });
	}

	add() {
		this.router.navigate(['./admin/crmRole']);
	}

	updateAuthority(role) {
		sessionStorage.setItem('role', role.name);
		this.router.navigate(['./admin/crmRole/authorityList'], {queryParams: {id: role.id}});
	}
}
