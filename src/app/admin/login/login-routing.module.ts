import { NgModule }                          from '@angular/core';
import { RouterModule, Routes }              from '@angular/router';

import { AuthGuard }                         from '../../auth-guard.service';
import { AuthGuardRole }                     from '../auth-guard-role.service';
import { AuthService }                       from '../../auth.service';
import { LoginComponent }                    from './login.component';
import { ForgetpwdComponent }                from './forgetpwd.component';

const loginRoutes: Routes = [
	{path: 'login', canActivate: [AuthGuardRole], component: LoginComponent},
	{path: 'forgetpwd', component: ForgetpwdComponent},
]

@NgModule({
	imports: [
		RouterModule.forChild(loginRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthGuard,
		AuthService
	]
})
export class LoginRoutingModule{

}
