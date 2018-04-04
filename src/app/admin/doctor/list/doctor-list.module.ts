import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NgZorroAntdModule }                 from 'ng-zorro-antd';

import { NavModule }                         from '../../nav/nav.module';

import { AngCommonModule }                   from '../../../common/ang-common.module';

import { DoctorListRoutingModule }           from './doctor-list.routing.module';

import { DoctorListComponent }               from './doctor-list.component';

@NgModule({
    declarations: [
        DoctorListComponent,
    ],
    exports: [
        DoctorListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        DoctorListRoutingModule,
    ]
})

export class DoctorListModule{

}
