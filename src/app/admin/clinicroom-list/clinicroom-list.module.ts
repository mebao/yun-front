import { NgModule }                          from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { FormsModule }                       from '@angular/forms';

import { NavModule }                         from '../nav/nav.module';

import { AngCommonModule }                   from '../../common/ang-common.module';

import { ClinicroomListRoutingModule }       from './clinicroom-list.routing.module';

import { ClinicroomListComponent }           from './clinicroom-list.component';

@NgModule({
    declarations: [
        ClinicroomListComponent,
    ],
    exports: [
        ClinicroomListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        ClinicroomListRoutingModule,
    ]
})

export class ClinicroomListModule{

}
