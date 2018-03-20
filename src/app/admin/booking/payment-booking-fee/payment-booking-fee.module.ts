import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NavModule }                       from '../../nav/nav.module';

import { PipeModule }                      from '../../../pipe/pipe.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { PaymentBookingFeeRoutingModule }  from './payment-booking-fee.routing.module';

import { PaymentBookingFee }               from './payment-booking-fee';

@NgModule({
    declarations: [
        PaymentBookingFee,
    ],
    exports: [
        PaymentBookingFee,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        PaymentBookingFeeRoutingModule,
    ]
})

export class PaymentBookingFeeModule{

}
