import { Component, Input, OnInit }             from '@angular/core';

import { AdminService }                         from '../admin.service';

@Component({
	selector: 'header-nav',
	templateUrl: './header-nav.component.html'
})
export class HeaderNavComponent{
	@Input() title: string;
	@Input() username: string;
	clinicRole: string;

	constructor(public adminService: AdminService) {}

	ngOnInit(): void {
		this.username = this.adminService.getUser().username;
		this.clinicRole = this.adminService.getUser().clinicRoleName;
	}
}
