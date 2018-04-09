import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalSupplierComponent }               from './medical-supplier.component';
import { MedicalSupplierListComponent }           from './medical-supplier-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MedicalSupplierListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalSupplierRoutingModule{

}
