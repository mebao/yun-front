import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalSupplierListComponent }           from './medical-supplier-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalSupplierListRoutingModule{

}
