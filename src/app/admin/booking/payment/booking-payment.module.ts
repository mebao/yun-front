import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';

import { NgZorroAntdModule }            from 'ng-zorro-antd';

import { NavModule }                    from '../../nav/nav.module';

import { PipeModule }                   from '../../../pipe/pipe.module';

import { AngCommonModule }              from '../../../common/ang-common.module';

import { BookingPaymentRoutingModule }  from './booking-payment.routing.module';

import { BookingPaymentComponent }      from './booking-payment.component';

@NgModule({
    declarations: [
        BookingPaymentComponent,
    ],
    exports: [
        BookingPaymentComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingPaymentRoutingModule,
    ]
})

export class BookingPaymentModule{

}
