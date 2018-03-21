import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MedicalCheckComponent }                  from './medical-check.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MedicalCheckComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MedicalCheckRoutingModule{

}
