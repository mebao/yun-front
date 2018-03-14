import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicServiceRoutingModule }        from './clinic-service.routing.module';

import { ClinicServiceComponent }            from './clinic-service.component';

@NgModule({
    declarations: [
        ClinicServiceComponent,
    ],
    exports: [
        ClinicServiceComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ClinicServiceRoutingModule,
    ]
})

export class ClinicServiceModule{

}
