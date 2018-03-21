import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseInfoComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalPurchaseInfoRoutingModule{

}
