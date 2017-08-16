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
				this.adminService.setCookie('user', JSON.stringify(results.admininfo), 1);
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