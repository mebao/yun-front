import { NgModule }                           from '@angular/core';
import { RouterModule }                       from '@angular/router';

import { AuthGuardRole }                      from './../../auth-guard-role.service';

import { DoctorRecordTempletListComponent }   from './doctor-record-templet-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorRecordTempletListComponent
        }
    ])]
})

export class DoctorRecordTempletListRoutingModule{

}
