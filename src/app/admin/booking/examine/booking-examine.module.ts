import { NgModule }                           from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';

import { NgZorroAntdModule }                  from 'ng-zorro-antd';

import { NavModule }                          from '../../nav/nav.module';

import { AngCommonModule }                    from '../../../common/ang-common.module';

import { BookingExamineRoutingModule }        from './booking-examine.routing.module';

import { BookingExamineCase }                 from './booking-examine-case';
import { BookingExamineRecord }               from './booking-examine-record';

@NgModule({
    declarations: [
        BookingExamineCase,
        BookingExamineRecord,
    ],
    exports: [
        BookingExamineCase,
        BookingExamineRecord,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        BookingExamineRoutingModule,
    ]
})

export class BookingExamineModule{

}
