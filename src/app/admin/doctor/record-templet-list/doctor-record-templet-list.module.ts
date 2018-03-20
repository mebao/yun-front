import { NgModule }                                 from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';

import { NavModule }                                from '../../nav/nav.module';

import { AngCommonModule }                          from '../../../common/ang-common.module';

import { DoctorRecordTempletListRoutingModule }     from './doctor-record-templet-list.routing.module';

import { DoctorRecordTempletListComponent }         from './doctor-record-templet-list.component';

@NgModule({
    declarations: [
        DoctorRecordTempletListComponent,
    ],
    exports: [
        DoctorRecordTempletListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorRecordTempletListRoutingModule,
    ]
})

export class DoctorRecordTempletListModule{

}
