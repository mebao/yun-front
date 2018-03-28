import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../../nav/nav.module';

import { BookingUpdateInfoRoutingModule }    from './booking-update-info.routing.module';

import { BookingUpdateInfo }                 from './booking-update-info';

@NgModule({
    declarations: [
        BookingUpdateInfo,
    ],
    exports: [
        BookingUpdateInfo,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        BookingUpdateInfoRoutingModule,
    ],
})

export class BookingUpdateInfoModule{

}
