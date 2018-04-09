import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { PrescriptListComponent }               from './prescript-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'backList',
            loadChildren: './back-list/prescript-back-list.module#PrescriptBackListModule',
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: PrescriptListComponent,
        },
        {
            path: 'sale',
            loadChildren: './sale/prescript-sale.module#PrescriptSaleModule',
        }
    ])],
    exports: [RouterModule]
})

export class PrescriptRoutingModule{

}
