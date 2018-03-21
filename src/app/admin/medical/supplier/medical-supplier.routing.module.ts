import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalSupplierComponent }               from './medical-supplier.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalSupplierRoutingModule{

}
