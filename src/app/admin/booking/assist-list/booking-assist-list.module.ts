import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NavModule }                       from '../../nav/nav.module';

import { PipeModule }                      from '../../../pipe/pipe.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { BookingAssistListRoutingModule }  from './booking-assist-list.routing.module';

import { BookingAssistList }               from './booking-assist-list.component';

@NgModule({
    declarations: [
        BookingAssistList,
    ],
    exports: [
        BookingAssistList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingAssistListRoutingModule,
    ]
})

export class BookingAssistListModule{

}
