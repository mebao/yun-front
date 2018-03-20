import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorCaseTempletListComponent }     from './doctor-case-templet-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: DoctorCaseTempletListComponent
        }
    ])]
})

export class DoctorCaseTempletListRoutingModule{

}
