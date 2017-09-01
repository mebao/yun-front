import { Component, Input }              from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'left-nav',
	templateUrl: './left-nav.component.html'
})
export class LeftNavComponent{
	@Input() title: string;
	userRole: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	ngOnInit() {
		this.userRole = this.adminService.getUser().role;
	}

	logout() {
		this.adminService.delCookie('user');
		this.router.navigate(['./login']);
	}
}