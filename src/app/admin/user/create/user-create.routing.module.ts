import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../../auth-guard-role.service';

import { CreateUserComponent }            from './create-user.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CreateUserComponent,
        },
    ])]
})

export class UserCreateRoutingModule{

}
