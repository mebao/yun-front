import { NgModule }                  from '@angular/core';
import { RouterModule }              from '@angular/router';

import { AuthGuardRole }             from './../../auth-guard-role.service';

import { BookingAddFeeComponent }    from './booking-add-fee.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: BookingAddFeeComponent,
        }
    ])]
})

export class BookingAddFeeRoutingModule{

}
