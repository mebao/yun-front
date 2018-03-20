import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../../auth-guard-role.service';

import { DoctorInfoComponent }          from './doctor-info.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorInfoComponent
        }
    ])]
})

export class DoctorInfoRoutingModule{

}
