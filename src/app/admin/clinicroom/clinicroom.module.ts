import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicroomRoutingModule }           from './clinicroom.routing.module';

import { ClinicroomComponent }               from './clinicroom.component';
import { ClinicroomListComponent }           from './clinicroom-list.component';
import { ClinicroomRecordsComponent }        from './clinicroom-records.component';

@NgModule({
    declarations: [
        ClinicroomComponent,
        ClinicroomListComponent,
        ClinicroomRecordsComponent,
    ],
    exports: [
        ClinicroomComponent,
        ClinicroomListComponent,
        ClinicroomRecordsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ClinicroomRoutingModule,
    ]
})

export class ClinicroomModule{

}
