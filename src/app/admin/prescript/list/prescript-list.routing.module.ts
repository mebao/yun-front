import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { PrescriptListComponent }               from './prescript-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PrescriptListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class PrescriptListRoutingModule{

}
