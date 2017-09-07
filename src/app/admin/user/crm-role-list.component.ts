import { Component }                         from '@angular/core';
import { Router }                            from '@angular/router';

import { AdminService }                      from '../admin.service';

@Component({
	selector: 'admin-crm-role-list',
	templateUrl: './crm-role-list.component.html',
})
export class CrmRoleListComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	roleList: any[];
	hasData: boolean;
	url: string;
	searchInfo: {
		status: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '角色管理',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.roleList = [];
		this.hasData = false;

		this.url = '?username=' + this.adminService.getUser().username
			 + '&token=' + this.adminService.getUser().token
			 + '&clinic_id=' + this.adminService.getUser().clinicId;

		this.searchInfo = {
			status: ''
		}

		this.search();
	}

	search() {
		var urlOptions = this.url;
		if(this.searchInfo.status != ''){
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
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('状态修改成功', '');
				this.search();
			}
		});
	}

	getData(urlOptions) {
		this.adminService.clinicrolelist(urlOptions).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				this.roleList = results.list;
				this.hasData = true;
			}
		});
	}

	add() {
		this.router.navigate(['./admin/crmRole']);
	}

	updateAuthority(role) {
		this.router.navigate(['./admin/roleAuthorityList'], {queryParams: {id: role.id}});
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
