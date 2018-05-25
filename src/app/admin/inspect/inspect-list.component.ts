import { Component, OnInit }               from '@angular/core';
import { Router, ActivatedRoute }          from '@angular/router';

import { NzMessageService }                from 'ng-zorro-antd';

import { AdminService }                    from '../admin.service';

@Component({
	selector: 'admin-setup-inspect-list',
	templateUrl: './inspect-list.component.html',
})
export class SetupInspectListComponent{
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
	projectlist: any[];
	hasData: boolean;

	constructor(
		private _message: NzMessageService,
		private adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.topBar = {
			title: '检查项目列表',
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

		this.loadingShow = true;

		this.projectlist = [];
		this.hasData = false;

		//获取检查项目列表
		var urlOptions = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;
		this.adminService.checkprojects(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.loadingShow = false;
				this._message.error(data.errorMsg);
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.projectlist = results.list;
				this.hasData = true;
				this.loadingShow = false;
			}
		}).catch(() => {
			this.loadingShow = false;
            this._message.error('服务器错误');
        });
	}

	add() {
		this.router.navigate(['./admin/setupInspect']);
	}

	update(project) {
		this.router.navigate(['./admin/setupInspect'], {queryParams: {id: project.id}});
	}
}
