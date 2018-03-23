import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../../auth-guard-role.service';

import { CrmRoleComponent }               from './crm-role.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CrmRoleComponent,
        },
    ])]
})

export class CrmRoleRoutingModule{

}
