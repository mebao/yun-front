import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicServiceListRoutingModule }    from './clinic-service-list.routing.module';

import { ClinicServiceListComponent }        from './clinic-service-list.component';

@NgModule({
    declarations: [
        ClinicServiceListComponent,
    ],
    exports: [
        ClinicServiceListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ClinicServiceListRoutingModule,
    ]
})

export class ClinicServiceListModule{

}
