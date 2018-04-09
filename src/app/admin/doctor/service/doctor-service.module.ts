import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../../nav/nav.module';

import { AngCommonModule }                   from '../../../common/ang-common.module';

import { DoctorServiceRoutingModule }        from './doctor-service.routing.module';

import { DoctorServiceComponent }            from './doctor-service.component';
import { DoctorServiceListComponent }        from './doctor-service-list.component';

@NgModule({
    declarations: [
        DoctorServiceComponent,
        DoctorServiceListComponent,
    ],
    exports: [
        DoctorServiceComponent,
        DoctorServiceListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorServiceRoutingModule,
    ]
})

export class DoctorServiceModule{

}
