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
        const user = this.getCookie('user');
    	if(user && user != ''){
    		return true;
    	}

    	this.authService.redirectUrl = url;

    	this.router.navigate(['/login']);
    	return false;
    }

    getCookie(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return arr[2];
        else
        return null;
    }
}