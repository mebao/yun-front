import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../../auth-guard-role.service';

import { CrmUserListComponent }           from './crm-user-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CrmUserListComponent,
        },
    ])]
})

export class CrmUserListRoutingModule{

}
