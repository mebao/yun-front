import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalPurchaseComponent }               from './medical-purchase.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalPurchaseComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalPurchaseRoutingModule{

}
