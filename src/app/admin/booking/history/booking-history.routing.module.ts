import { NgModule }                  from '@angular/core';
import { RouterModule }              from '@angular/router';

import { AuthGuardRole }             from './../../auth-guard-role.service';

import { BookingHistoryComponent }    from './booking-history.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingHistoryComponent,
        }
    ])]
})

export class BookingHistoryRoutingModule{

}
