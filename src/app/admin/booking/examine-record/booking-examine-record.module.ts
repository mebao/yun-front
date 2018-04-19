import { NgModule }                           from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';

import { NgZorroAntdModule }                  from 'ng-zorro-antd';

import { NavModule }                          from '../../nav/nav.module';

import { AngCommonModule }                    from '../../../common/ang-common.module';

import { BookingExamineRecordRoutingModule }  from './booking-examine-record.routing.module';

import { BookingExamineRecord }               from './booking-examine-record';

@NgModule({
    declarations: [
        BookingExamineRecord,
    ],
    exports: [
        BookingExamineRecord,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        BookingExamineRecordRoutingModule,
    ]
})

export class BookingExamineRecordModule{

}
