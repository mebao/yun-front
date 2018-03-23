import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../../auth-guard-role.service';

import { RoleAuthorityListComponent }     from './role-authority-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: RoleAuthorityListComponent,
        },
    ])]
})

export class RoleAuthorityListRoutingModule{

}
