import { NgModule }                      from '@angular/core';
import { RouterModule }                  from '@angular/router';

import { AuthGuardRole }                 from './../../auth-guard-role.service';

import { BookingCasehistoryComponent }   from './booking-casehistory.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: BookingCasehistoryComponent,
        }
    ])]
})

export class BookingCasehistoryRoutingModule{

}
