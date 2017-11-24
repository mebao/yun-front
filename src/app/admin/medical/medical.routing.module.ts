import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../auth-guard-role.service';

import { MedicalCheckListComponent }              from './medical-check-list.component';
import { MedicalCheckComponent }                  from './medical-check.component';
import { MedicalHasListComponent }                from './medical-has-list.component';
import { MedicalHasComponent }                    from './medical-has.component';
import { MedicalListComponent }                   from './medical-list.component';
import { MedicalLostListComponent }               from './medical-lost-list.component';
import { MedicalLostComponent }                   from './medical-lost.component';
import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';
import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';
import { MedicalPurchaseComponent }               from './medical-purchase.component';
import { MedicalSupplierListComponent }           from './medical-supplier-list.component';
import { MedicalSupplierComponent }               from './medical-supplier.component';
import { MedicalComponent }                       from './medical.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'checkList',
            canActivate: [AuthGuardRole],
            component: MedicalCheckListComponent,
        },
        {
            path: 'check',
            canActivate: [AuthGuardRole],
            component: MedicalCheckComponent,
        },
        {
            path: 'hasList',
            canActivate: [AuthGuardRole],
            component: MedicalHasListComponent,
        },
        {
            path: 'has',
            canActivate: [AuthGuardRole],
            component: MedicalHasComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalListComponent,
        },
        {
            path: 'lostList',
            canActivate: [AuthGuardRole],
            component: MedicalLostListComponent,
        },
        {
            path: 'lost',
            canActivate: [AuthGuardRole],
            component: MedicalLostComponent,
        },
        {
            path: 'purchaseInfo',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseInfoComponent,
        },
        {
            path: 'purchaseList',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseListComponent,
        },
        {
            path: 'purchase',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseComponent,
        },
        {
            path: 'supplierList',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierListComponent,
        },
        {
            path: 'supplier',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierComponent,
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
