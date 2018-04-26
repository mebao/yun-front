import { NgModule }                                 from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';

import { NavModule }                                from '../../nav/nav.module';

import { AngCommonModule }                          from '../../../common/ang-common.module';

import { DoctorRecordTempletRoutingModule }         from './doctor-record-templet.routing.module';

import { DoctorRecordTempletComponent }             from './doctor-record-templet.component';
import { DoctorRecordTempletListComponent }         from './doctor-record-templet-list.component';

import { NgZorroAntdModule }                        from 'ng-zorro-antd';

@NgModule({
    declarations: [
        DoctorRecordTempletComponent,
        DoctorRecordTempletListComponent,
    ],
    exports: [
        DoctorRecordTempletComponent,
        DoctorRecordTempletListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorRecordTempletRoutingModule,
        NgZorroAntdModule,
    ]
})

export class DoctorRecordTempletModule{

}
