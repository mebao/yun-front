import { NgModule }                 from '@angular/core';
import { RouterModule }             from '@angular/router';

import { AuthGuardRole }            from './../../auth-guard-role.service';

import { PaymentBookingFee }        from './payment-booking-fee';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: PaymentBookingFee,
        }
    ])]
})

export class PaymentBookingFeeRoutingModule{

}
