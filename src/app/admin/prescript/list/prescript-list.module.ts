import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptListRoutingModule }           from './prescript-list.routing.module';

import { PrescriptListComponent }               from './prescript-list.component';

@NgModule({
    declarations: [
        PrescriptListComponent,
    ],
    exports: [
        PrescriptListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptListRoutingModule,
    ]
})

export class PrescriptListModule{

}
