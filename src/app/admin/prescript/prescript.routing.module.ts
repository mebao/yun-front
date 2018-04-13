import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../auth-guard-role.service';

import { PrescriptListComponent }               from './prescript-list.component';
import { PrescriptTcmList }                     from './prescript-tcm-list';

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
            path: 'tcmList',
            canActivate: [AuthGuardRole],
            component: PrescriptTcmList,
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
