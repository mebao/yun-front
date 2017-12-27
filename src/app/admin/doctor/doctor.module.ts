import { NgModule }                              from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { FormsModule }                           from '@angular/forms';

//nav
import { NavModule }                             from '../nav/nav.module';

// common
import { AngCommonModule }                       from '../../common/ang-common.module';

import { DoctorRoutingModule }                   from './doctor.routing.module';

import { DoctorListComponent }                   from './doctor-list.component';
import { DoctorServiceListComponent }            from './doctor-service-list.component';
import { DoctorServiceComponent }                from './doctor-service.component';
import { DoctorInfoComponent }                   from './doctor-info.component';
import { DoctorRecordTempletListComponent }      from './doctor-record-templet-list.component';
import { DoctorRecordTempletComponent }          from './doctor-record-templet.component';
import { DoctorCaseTempletListComponent }        from './doctor-case-templet-list.component';
import { DoctorCaseTempletComponent }            from './doctor-case-templet.component';

@NgModule({
    declarations: [
        DoctorListComponent,
        DoctorServiceListComponent,
        DoctorServiceComponent,
        DoctorInfoComponent,
        DoctorRecordTempletListComponent,
        DoctorRecordTempletComponent,
        DoctorCaseTempletListComponent,
        DoctorCaseTempletComponent,
    ],
    exports: [
        DoctorListComponent,
        DoctorServiceListComponent,
        DoctorServiceComponent,
        DoctorInfoComponent,
        DoctorRecordTempletListComponent,
        DoctorRecordTempletComponent,
        DoctorCaseTempletListComponent,
        DoctorCaseTempletComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorRoutingModule,
    ]
})

export class DoctorModule{

}
