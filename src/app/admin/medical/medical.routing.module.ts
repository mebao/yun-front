import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../auth-guard-role.service';

import { MedicalComponent }                       from './medical.component';
import { MedicalListComponent }                   from './medical-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'checkList',
            loadChildren: './check-list/medical-check-list.module#MedicalCheckListModule',
        },
        {
            path: 'check',
            loadChildren: './check/medical-check.module#MedicalCheckModule',
        },
        {
            path: 'hasList',
            loadChildren: './has-list/medical-has-list.module#MedicalHasListModule',
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
            path: 'lostList',
            loadChildren: './lost-list/medical-lost-list.module#MedicalLostListModule',
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
            path: 'supplierList',
            loadChildren: './supplier-list/medical-supplier-list.module#MedicalSupplierListModule',
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
