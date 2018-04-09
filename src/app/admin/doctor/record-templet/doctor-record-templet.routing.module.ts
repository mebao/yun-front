import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorRecordTempletComponent }       from './doctor-record-templet.component';
import { DoctorRecordTempletListComponent }   from './doctor-record-templet-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletComponent
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletListComponent
        }
    ])]
})

export class DoctorRecordTempletRoutingModule{

}
