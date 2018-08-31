import { Injectable }     from '@angular/core';
import { CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    }                     from '@angular/router';
import { AuthService }    from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(private authService: AuthService, private router: Router){}

   	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
     	let url: string = state.url;
     	return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean{
        try{
            const user = this.getCookie('user');
            JSON.parse(this.getCookie('user'));
            if(user && user != ''){
                return true;
            }
    
            this.authService.redirectUrl = url;
    
            this.router.navigate(['/login']);
            return false;
        }catch(e) {
            this.delCookie('user');
            this.router.navigate(['/login']);
            return false;
        }
    }

    getCookie(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return decodeURIComponent(arr[2]);
        }else{
            return null;
        }
    }
    
    delCookie(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 2*24*60*60*1000);
		var cval= this.getCookie(name);
		if(cval!=null){
			var pathList = [
				'/',
				'/admin',
				'/admin/workbench',
				'/admin/material',
				'/admin/medical',
				'/admin/scheduling',
				'/admin/prescript',
				'/admin/authorize',
				'/admin/doctor',
				'/admin/crmuser',
				'/admin/docbooking',
			]
			for(var i in pathList){
				document.cookie = name + "=" + cval + ";expires=" + exp + ";Path=" + pathList[i];
			}
		}
	}
}