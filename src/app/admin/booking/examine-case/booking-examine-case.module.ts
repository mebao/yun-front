import { NgModule }                           from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { FormsModule }                        from '@angular/forms';

import { NavModule }                          from '../../nav/nav.module';

import { AngCommonModule }                    from '../../../common/ang-common.module';

import { BookingExamineCaseRoutingModule }    from './booking-examine-case.routing.module';

import { BookingExamineCase }                 from './booking-examine-case';

@NgModule({
    declarations: [
        BookingExamineCase,
    ],
    exports: [
        BookingExamineCase,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        BookingExamineCaseRoutingModule,
    ]
})

export class BookingExamineCaseModule{

}
