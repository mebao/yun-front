import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';

//nav
import { NavModule } from '../../nav/nav.module';

//common
import { AngCommonModule } from '../../../common/ang-common.module';

import { BookingPhyexamRoutingModule } from './booking-phyexam.routing.module';

import { BookingPhyexam } from './booking-phyexam';
import { BookingPhyexamList } from './booking-phyexam-list';

@NgModule({
    declarations: [
        BookingPhyexam,
        BookingPhyexamList,
    ],
    exports: [
        BookingPhyexam,
        BookingPhyexamList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        BookingPhyexamRoutingModule,
    ]
})

export class BookingPhyexamModule {

}
