import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { DoctorRoutingModule }               from './doctor.routing.module';

import { DoctorListComponent }               from './doctor-list.component';
import { DoctorInfoComponent }               from './doctor-info.component';

@NgModule({
    declarations: [
        DoctorListComponent,
        DoctorInfoComponent,
    ],
    exports: [
        DoctorListComponent,
        DoctorInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DoctorRoutingModule,
    ]
})

export class DoctorModule{

}
