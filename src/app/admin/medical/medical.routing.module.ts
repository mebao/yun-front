import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../auth-guard-role.service';

import { MedicalComponent }                       from './medical.component';
import { MedicalListComponent }                   from './medical-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'check',
            loadChildren: './check/medical-check.module#MedicalCheckModule',
        },
        {
            path: 'has',
            loadChildren: './has/medical-has.module#MedicalHasModule',
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalListComponent,
        },
        {
            path: 'lost',
            loadChildren: './lost/medical-lost.module#MedicalLostModule',
        },
        {
            path: 'purchaseInfo',
            loadChildren: './purchase-info/medical-purchase-info.module#MedicalPurchaseInfoModule',
        },
        {
            path: 'purchaseList',
            loadChildren: './purchase-list/medical-purchase-list.module#MedicalPurchaseListModule',
        },
        {
            path: 'purchase',
            loadChildren: './purchase/medical-purchase.module#MedicalPurchaseModule',
        },
        {
            path: 'supplier',
            loadChildren: './supplier/medical-supplier.module#MedicalSupplierModule',
        },
        {
            path: 'index',
            canActivate: [AuthGuardRole],
            component: MedicalComponent,
        }
    ])],
    exports: [RouterModule]
})

export class MedicalRoutingModule{

}
