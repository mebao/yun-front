import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../../nav/nav.module';

import { PipeModule }                from '../../../pipe/pipe.module';

import { AngCommonModule }           from '../../../common/ang-common.module';

import { BookingInfoRoutingModule }  from './booking-info.routing.module';

import { BookingInfoComponent }      from './booking-info.component';

@NgModule({
    declarations: [
        BookingInfoComponent,
    ],
    exports: [
        BookingInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingInfoRoutingModule,
    ]
})

export class BookingInfoModule{

}
