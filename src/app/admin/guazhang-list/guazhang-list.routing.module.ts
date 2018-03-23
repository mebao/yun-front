import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

import { GuazhangList }                   from './guazhang-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: GuazhangList,
        },
    ])]
})

export class GuazhangListRoutingModule{

}
