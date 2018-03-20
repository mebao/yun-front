import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorRecordTempletComponent }       from './doctor-record-templet.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletComponent
        }
    ])]
})

export class DoctorRecordTempletRoutingModule{

}
