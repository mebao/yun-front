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
        },
        // {
        //     path: 'tcm',
        //     loadChildren: './tcm/tcm.module#TcmModule',
        // }
    ])],
    exports: [RouterModule]
})

export class MedicalRoutingModule{

}
