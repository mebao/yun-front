import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NavModule }                       from '../../nav/nav.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { BookingChargeRoutingModule }      from './booking-charge.routing.module';

import { BookingChargeComponent }          from './booking-charge.component';

@NgModule({
    declarations: [
        BookingChargeComponent,
    ],
    exports: [
        BookingChargeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingChargeRoutingModule,
    ]
})

export class BookingChargeModule{

}
