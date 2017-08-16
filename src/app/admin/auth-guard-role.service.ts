import {Injectable}           from '@angular/core';
import { CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	}                         from '@angular/router';
import { AdminService }       from './admin.service';

@Injectable()
export class AuthGuardRole implements CanActivate{
	constructor(
		private router: Router,
		private adminService: AdminService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = state.url;
		return this.checkRole(url);
	}

	checkRole(url: string): boolean{
		const role = this.adminService.getUser().role;
		if(role && role == '0'){
			return true;
		}

		this.router.navigate(['./admin/noPermissions']);
		return false;
	}
}