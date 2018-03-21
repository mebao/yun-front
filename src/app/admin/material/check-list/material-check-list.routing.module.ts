import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialCheckListComponent }             from './material-check-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialCheckListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialCheckListRoutingModule{

}
