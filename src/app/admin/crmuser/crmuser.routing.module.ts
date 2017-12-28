import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

import { CrmUserListComponent }           from './crm-user-list.component';
import { CrmUserComponent }               from './crm-user.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: CrmUserListComponent,
        },
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CrmUserComponent,
        },
    ])]
})

export class CrmuserRoutingModule{

}
