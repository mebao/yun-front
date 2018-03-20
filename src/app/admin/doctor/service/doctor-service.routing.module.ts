import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../../auth-guard-role.service';

import { DoctorServiceComponent }       from './doctor-service.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorServiceComponent
        }
    ])]
})

export class DoctorServiceRoutingModule{

}
