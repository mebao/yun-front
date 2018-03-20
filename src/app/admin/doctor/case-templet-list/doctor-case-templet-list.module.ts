import { NgModule }                                 from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';

import { NavModule }                                from '../../nav/nav.module';

import { AngCommonModule }                          from '../../../common/ang-common.module';

import { DoctorCaseTempletListRoutingModule }       from './doctor-case-templet-list.routing.module';

import { DoctorCaseTempletListComponent }           from './doctor-case-templet-list.component';

@NgModule({
    declarations: [
        DoctorCaseTempletListComponent,
    ],
    exports: [
        DoctorCaseTempletListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorCaseTempletListRoutingModule,
    ]
})

export class DoctorCaseTempletListModule{

}
