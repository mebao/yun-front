import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptBackListRoutingModule }       from './prescript-back-list.routing.module';

import { PrescriptBackListComponent }           from './prescript-back-list.component';

@NgModule({
    declarations: [
        PrescriptBackListComponent,
    ],
    exports: [
        PrescriptBackListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptBackListRoutingModule,
    ]
})

export class PrescriptBackListModule{

}
