import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicroomRecordsRoutingModule }    from './clinicroom-records.routing.module';

import { ClinicroomRecordsComponent }        from './clinicroom-records.component';

@NgModule({
    declarations: [
        ClinicroomRecordsComponent,
    ],
    exports: [
        ClinicroomRecordsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ClinicroomRecordsRoutingModule,
    ]
})

export class ClinicroomRecordsModule{

}
