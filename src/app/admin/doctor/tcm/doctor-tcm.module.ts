import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule, ReactiveFormsModule }       from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { DoctorTcmRoutingModule }                 from './doctor-tcm.routing.module';

import { DoctorTcm }                              from './doctor-tcm';
import { DoctorTcmList }                          from './doctor-tcm-list';

@NgModule({
    declarations: [
        DoctorTcm,
        DoctorTcmList,
    ],
    exports: [
        DoctorTcm,
        DoctorTcmList,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DoctorTcmRoutingModule,
    ]
})

export class DoctorTcmModule{

}
