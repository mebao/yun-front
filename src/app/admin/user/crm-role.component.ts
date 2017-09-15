import { Component }                        from '@angular/core';
import { Router }                           from '@angular/router';

import { AdminService }                     from '../admin.service';

@Component({
	selector: 'admin-crm-role',
	templateUrl: './crm-role.component.html',
})
export class CrmRoleComponent{
	topBar: {
		title: string,
		back: boolean,
	};
	toast: {
		show: number,
		text: string,
		type:  string,
	};
	roleInfo: {
		name: string,
	}

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.topBar = {
			title: '角色',
			back: true,
		}
		this.toast = {
			show: 0,
			text: '',
			type: '',
		};

		this.roleInfo = {
			name: '',
		}
	}

	create(f) {
		if(f.value.name == ''){
			this.toastTab('角色名不可为空', 'error');
			return;
		}
		var params = {
			username: this.adminService.getUser().username,
			token: this.adminService.getUser().token,
			clinic_id: this.adminService.getUser().clinicId,
			name: f.value.name,
		}

		this.adminService.clinicrole('', params).then((data) => {
			if(data.status == 'no'){
				this.toastTab(data.errorMsg, 'error');
			}else{
				this.toastTab('角色创建成功', '');
				setTimeout(() => {
					this.router.navigate(['./admin/crmRoleList']);
				}, 2000);
			}
		});
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
