import { NgModule }                                 from '@angular/core';
import { CommonModule }                             from '@angular/common';
import { FormsModule }                              from '@angular/forms';

import { NavModule }                                from '../../nav/nav.module';

import { AngCommonModule }                          from '../../../common/ang-common.module';

import { DoctorCaseTempletRoutingModule }           from './doctor-case-templet.routing.module';

import { DoctorCaseTempletComponent }               from './doctor-case-templet.component';
import { DoctorCaseTempletListComponent }           from './doctor-case-templet-list.component';

@NgModule({
    declarations: [
        DoctorCaseTempletComponent,
        DoctorCaseTempletListComponent,
    ],
    exports: [
        DoctorCaseTempletComponent,
        DoctorCaseTempletListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorCaseTempletRoutingModule,
    ]
})

export class DoctorCaseTempletModule{

}
