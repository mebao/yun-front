import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicroomRoutingModule }       from './clinicroom.routing.module';

import { ClinicroomComponent }           from './clinicroom.component';

@NgModule({
    declarations: [
        ClinicroomComponent,
    ],
    exports: [
        ClinicroomComponent,
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
