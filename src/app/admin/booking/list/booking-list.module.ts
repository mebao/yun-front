import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NavModule }                 from '../../nav/nav.module';

import { PipeModule }                from '../../../pipe/pipe.module';

import { AngCommonModule }           from '../../../common/ang-common.module';

import { BookingListRoutingModule }  from './booking-list.routing.module';

import { BookingListComponent }      from './booking-list.component';

@NgModule({
    declarations: [
        BookingListComponent,
    ],
    exports: [
        BookingListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingListRoutingModule,
    ]
})

export class BookingListModule{

}
