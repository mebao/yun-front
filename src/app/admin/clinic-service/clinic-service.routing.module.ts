import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { ClinicServiceComponent }       from './clinic-service.component';
import { ClinicServiceListComponent }   from './clinic-service-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: ClinicServiceComponent
        },
        {
            path: 'list',
            // canActivate: [AuthGuardRole],
            component: ClinicServiceListComponent
        }
    ])]
})

export class ClinicServiceRoutingModule{

}
