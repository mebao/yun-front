import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../../auth-guard-role.service';

import { DoctorServiceListComponent }   from './doctor-service-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorServiceListComponent
        }
    ])]
})

export class DoctorServiceListRoutingModule{

}
