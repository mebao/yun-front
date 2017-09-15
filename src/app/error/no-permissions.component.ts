import { Component }                    from '@angular/core';
import { Router }                       from '@angular/router';

import { AdminService }                 from '../admin/admin.service';

@Component({
	selector: 'app-no-permissions',
	templateUrl: './no-permissions.component.html',
	styleUrls: ['./no-permissions.component.scss'],
})
export class NoPermissionsComponent{
	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	logout() {
		this.adminService.delCookie('user');
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		this.router.navigate(['./login']);
	}
}
