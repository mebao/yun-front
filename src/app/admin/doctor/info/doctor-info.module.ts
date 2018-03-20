import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../../nav/nav.module';

import { AngCommonModule }                   from '../../../common/ang-common.module';

import { DoctorInfoRoutingModule }           from './doctor-info.routing.module';

import { DoctorInfoComponent }               from './doctor-info.component';

@NgModule({
    declarations: [
        DoctorInfoComponent,
    ],
    exports: [
        DoctorInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorInfoRoutingModule,
    ]
})

export class DoctorInfoModule{

}
