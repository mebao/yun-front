import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalPurchaseComponent }               from './medical-purchase.component';
import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';
import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseListComponent,
        },
        {
            path: 'info',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseInfoComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalPurchaseRoutingModule{

}
