import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NgZorroAntdModule }         from 'ng-zorro-antd';

import { NavModule }                 from '../nav/nav.module';

import { PipeModule }                from '../../pipe/pipe.module';

import { AngCommonModule }           from '../../common/ang-common.module';

import { BookingRoutingModule }      from './booking.routing.module';

import { BookingComponent }          from './booking.component';

@NgModule({
    declarations: [
        BookingComponent,
    ],
    exports: [
        BookingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingRoutingModule,
    ]
})

export class BookingModule{

}
