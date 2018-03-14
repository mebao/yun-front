import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { ClinicroomRecordsComponent }   from './clinicroom-records.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: ClinicroomRecordsComponent
        }
    ])]
})

export class ClinicroomRecordsRoutingModule{

}
