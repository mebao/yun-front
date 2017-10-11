import { Component, Input, OnInit }             from '@angular/core';
import { Router }                               from '@angular/router';

import { AdminService }                         from '../admin.service';

@Component({
	selector: 'header-nav',
	templateUrl: './header-nav.component.html',
	styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent{
	@Input() title: string;
	@Input() username: string;
	clinicRole: string;
	clinicName: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.username = this.adminService.getUser().username;
		this.clinicRole = this.adminService.getUser().clinicRoleName;
		this.clinicName = this.adminService.getUser().clinicName;
	}

	logout() {
		this.adminService.delCookie('user');
		sessionStorage.removeItem('userClinicRoles');
		sessionStorage.removeItem('userClinicRolesInfos');
		this.router.navigate(['./login']);
	}
}
