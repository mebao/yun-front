import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../../auth-guard-role.service';

import { CrmRoleComponent }               from './crm-role.component';
import { CrmRoleListComponent }           from './crm-role-list.component';
import { CrmRoleAuthorityListComponent }  from './authority-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CrmRoleComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: CrmRoleListComponent,
        },
        {
            path: 'authorityList',
            canActivate: [AuthGuardRole],
            component: CrmRoleAuthorityListComponent,
        },
    ])]
})

export class CrmRoleRoutingModule{

}
