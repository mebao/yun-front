import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { PrescriptSaleComponent }               from './prescript-sale.component';
import { PrescriptSaleListComponent }           from './prescript-sale-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class PrescriptSaleRoutingModule{

}
