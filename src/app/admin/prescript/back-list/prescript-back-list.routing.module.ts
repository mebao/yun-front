import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { PrescriptBackListComponent }           from './prescript-back-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PrescriptBackListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class PrescriptBackListRoutingModule{

}
