import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { PrescriptSaleComponent }               from './prescript-sale.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleComponent,
        },
    ])],
    exports: [RouterModule]
})

export class PrescriptSaleRoutingModule{

}
