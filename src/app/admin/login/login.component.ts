import { Component, OnInit }            from '@angular/core';
import { Router }                       from '@angular/router';

import { AuthService }                  from '../../auth.service';
import { AdminService }                 from '../admin.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent{
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	admininfo: {
		clinicId: string,
		clinicRoleId: string,
		clinicRoleName: string,
		role: string,
		token: string,
		uid: string,
		username: string,
	}

	constructor(
		public authService: AuthService,
		public adminService: AdminService,
		public router: Router,
	) {}

	ngOnInit(): void {
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.admininfo = {
			clinicId: '',
			clinicRoleId: '',
			clinicRoleName: '',
			role: '',
			token: '',
			uid: '',
			username: '',
		}
	}

	login(username, password): void{
		username = username.trim();
		if(username == ''){
			this.toastTab('用户名不可为空', 'error');
			return;
		}
		password = password.trim();
		if(password == ''){
			this.toastTab('密码不可为空','error');
			return;
		}
		this.authService.login(username, password).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				var results = JSON.parse(JSON.stringify(data.results));
				//用户信息存储在cookie中
				this.admininfo = {
					clinicId: results.admininfo.clinicId,
					clinicRoleId: results.admininfo.clinicRoleId,
					clinicRoleName: results.admininfo.clinicRoleName,
					role: results.admininfo.role,
					token: results.admininfo.token,
					uid: results.admininfo.uid,
					username: results.admininfo.username,
				}
				this.adminService.setCookie('user', JSON.stringify(this.admininfo), 1);
				//角色信息存储在sessionStorage中
				sessionStorage.setItem('userClinicRoles', JSON.stringify(results.admininfo.clinicRoles));
				//清空sessionStorage中角色权限信息
				sessionStorage.removeItem('userClinicRolesInfos');

				let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin/workbenchReception';

				this.router.navigate([redirect]);
			}
		})
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
