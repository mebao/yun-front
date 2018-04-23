import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';

import { NgZorroAntdModule }         from 'ng-zorro-antd';

import { NavModule }                 from '../../nav/nav.module';

import { PipeModule }                from '../../../pipe/pipe.module';

import { AngCommonModule }           from '../../../common/ang-common.module';

import { BookingListRoutingModule }  from './booking-list.routing.module';

import { BookingListComponent }      from './booking-list.component';

import { ENgxPrintModule }          from "e-ngx-print";

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
        NgZorroAntdModule,
        NavModule,
        PipeModule,
        AngCommonModule,
        BookingListRoutingModule,
        ENgxPrintModule,
    ]
})

export class BookingListModule{

}
