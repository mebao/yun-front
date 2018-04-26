import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../../nav/nav.module';

import { AngCommonModule }                   from '../../../common/ang-common.module';

import { BookingUpdateRoutingModule }        from './booking-update.routing.module';

import { BookingUpdate }                     from './booking-update';

@NgModule({
    declarations: [
        BookingUpdate,
    ],
    exports: [
        BookingUpdate,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        BookingUpdateRoutingModule,
    ]
})

export class BookingUpdateModule{

}
