import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorCaseTempletComponent }         from './doctor-case-templet.component';
import { DoctorCaseTempletListComponent }     from './doctor-case-templet-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: DoctorCaseTempletComponent
        },
        {
            path: 'list',
            // canActivate: [AuthGuardRole],
            component: DoctorCaseTempletListComponent
        }
    ])]
})

export class DoctorCaseTempletRoutingModule{

}
