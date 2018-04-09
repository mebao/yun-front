import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { ClinicroomComponent }          from './clinicroom.component';
import { ClinicroomListComponent }      from './clinicroom-list.component';
import { ClinicroomRecordsComponent }   from './clinicroom-records.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: ClinicroomComponent
        },
        {
            path: 'list',
            // canActivate: [AuthGuardRole],
            component: ClinicroomListComponent
        },
        {
            path: 'records',
            // canActivate: [AuthGuardRole],
            component: ClinicroomRecordsComponent
        }
    ])]
})

export class ClinicroomRoutingModule{

}
