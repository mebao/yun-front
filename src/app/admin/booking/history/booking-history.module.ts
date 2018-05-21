import { NgModule }                        from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { FormsModule }                     from '@angular/forms';

import { NgZorroAntdModule }               from 'ng-zorro-antd';

import { NavModule }                       from '../../nav/nav.module';

import { AngCommonModule }                 from '../../../common/ang-common.module';

import { BookingHistoryRoutingModule }     from './booking-history.routing.module';

import { BookingHistoryComponent }         from './booking-history.component';

@NgModule({
    declarations: [
        BookingHistoryComponent,
    ],
    exports: [
        BookingHistoryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        BookingHistoryRoutingModule,
    ]
})

export class BookingHistoryModule{

}
