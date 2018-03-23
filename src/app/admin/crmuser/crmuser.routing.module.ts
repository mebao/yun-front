import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

import { CrmUserComponent }               from './crm-user.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'list',
            loadChildren: './list/crm-user-list.module#CrmUserListModule',
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
