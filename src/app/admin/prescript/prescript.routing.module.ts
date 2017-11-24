import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';


import { PrescriptBackListComponent }           from './prescript-back-list.component';
import { PrescriptListComponent }               from './prescript-list.component';
import { PrescriptSaleListComponent }           from './prescript-sale-list.component';
import { PrescriptSaleComponent }               from './prescript-sale.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'backList',
            canActivate: [AuthGuardRole],
            component: PrescriptBackListComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: PrescriptListComponent,
        },
        {
            path: 'saleList',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleListComponent,
        },
        {
            path: 'sale',
            canActivate: [AuthGuardRole],
            component: PrescriptSaleComponent,
        }
    ])],
    exports: [RouterModule]
})

export class PrescriptRoutingModule{

}
