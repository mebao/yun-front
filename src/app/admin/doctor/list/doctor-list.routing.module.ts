import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../../auth-guard-role.service';

import { DoctorListComponent }          from './doctor-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: DoctorListComponent
        }
    ])]
})

export class DoctorListRoutingModule{

}
