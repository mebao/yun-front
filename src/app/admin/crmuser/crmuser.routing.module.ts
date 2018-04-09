import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

import { CrmUserComponent }               from './crm-user.component';
import { CrmUserListComponent }           from './crm-user-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: CrmUserComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: CrmUserListComponent,
        }
    ])]
})

export class CrmuserRoutingModule{

}
