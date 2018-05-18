import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { BookingExamineCase }       from './booking-examine-case';
import { BookingExamineRecord }     from './booking-examine-record';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: 'case',
            canActivate: [AuthGuardRole],
            component: BookingExamineCase,
        },
        {
            path: 'health',
            canActivate: [AuthGuardRole],
            component: BookingExamineRecord,
        }
    ])]
})

export class BookingExamineRoutingModule{

}
