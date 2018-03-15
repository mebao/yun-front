import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';

import { NavModule }                    from '../../nav/nav.module';

import { AngCommonModule }              from '../../../common/ang-common.module';

import { BookingReceiveRoutingModule }  from './booking-receive.routing.module';

import { BookingReceiveComponent }      from './booking-receive.component';

@NgModule({
    declarations: [
        BookingReceiveComponent,
    ],
    exports: [
        BookingReceiveComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingReceiveRoutingModule,
    ]
})

export class BookingReceiveModule{

}
