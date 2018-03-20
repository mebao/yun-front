import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NavModule }                       from '../../nav/nav.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { BookingAddFeeRoutingModule }      from './booking-add-fee.routing.module';

import { BookingAddFeeComponent }          from './booking-add-fee.component';

@NgModule({
    declarations: [
        BookingAddFeeComponent,
    ],
    exports: [
        BookingAddFeeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingAddFeeRoutingModule,
    ]
})

export class BookingAddFeeModule{

}
