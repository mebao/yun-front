import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { PrescriptSaleListComponent }           from './prescript-sale-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class PrescriptSaleListRoutingModule{

}
