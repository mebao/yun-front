import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { BookingExamineRecord }       from './booking-examine-record';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingExamineRecord,
        }
    ])]
})

export class BookingExamineRecordRoutingModule{

}
