import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../../nav/nav.module';

import { AngCommonModule }           from '../../../common/ang-common.module';

import { BookingInRoutingModule }    from './booking-in.routing.module';

import { BookingInComponent }        from './booking-in.component';

@NgModule({
    declarations: [
        BookingInComponent,
    ],
    exports: [
        BookingInComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingInRoutingModule,
    ]
})

export class BookingInModule{

}
