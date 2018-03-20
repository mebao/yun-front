import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../../nav/nav.module';

import { AngCommonModule }                   from '../../../common/ang-common.module';

import { DoctorServiceListRoutingModule }    from './doctor-service-list.routing.module';

import { DoctorServiceListComponent }        from './doctor-service-list.component';

@NgModule({
    declarations: [
        DoctorServiceListComponent,
    ],
    exports: [
        DoctorServiceListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        DoctorServiceListRoutingModule,
    ]
})

export class DoctorServiceListModule{

}
