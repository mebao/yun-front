import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { PrescriptRoutingModule }               from './prescript.routing.module';

@NgModule({
    declarations: [
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptRoutingModule,
    ]
})

export class PrescriptModule{

}
