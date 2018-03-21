import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalLostComponent }                   from './medical-lost.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalLostComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalLostRoutingModule{

}
