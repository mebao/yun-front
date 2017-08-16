import { Component, Input }              from '@angular/core';
import { Router, ActivatedRoute }        from '@angular/router';

import { AdminService }                  from '../admin.service';

@Component({
	selector: 'left-nav',
	templateUrl: './left-nav.component.html'
})
export class LeftNavComponent{
	@Input() title: string;

	constructor(
		public adminService: AdminService,
		private router: Router,
	) {}

	logout() {
		this.adminService.delCookie('user');
		this.router.navigate(['./login']);
	}
}