import { NgModule }                                 from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';

import { NavModule }                                from '../../nav/nav.module';

import { AngCommonModule }                          from '../../../common/ang-common.module';

import { DoctorRecordTempletRoutingModule }     from './doctor-record-templet.routing.module';

import { DoctorRecordTempletComponent }         from './doctor-record-templet.component';

@NgModule({
    declarations: [
        DoctorRecordTempletComponent,
    ],
    exports: [
        DoctorRecordTempletComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorRecordTempletRoutingModule,
    ]
})

export class DoctorRecordTempletModule{

}
