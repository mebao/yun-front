import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorCaseTempletComponent }         from './doctor-case-templet.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: DoctorCaseTempletComponent
        }
    ])]
})

export class DoctorCaseTempletRoutingModule{

}
