import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalPurchaseListRoutingModule{

}
