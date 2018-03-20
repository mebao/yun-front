import { NgModule }                  from '@angular/core';
import { RouterModule }              from '@angular/router';

import { AuthGuardRole }             from './../../auth-guard-role.service';

import { BookingChargeComponent }    from './booking-charge.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: BookingChargeComponent,
        }
    ])]
})

export class BookingChargeRoutingModule{

}
