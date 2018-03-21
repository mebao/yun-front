import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalCheckRoutingModule }              from './medical-check.routing.module';

import { MedicalCheckComponent }                  from './medical-check.component';

@NgModule({
    declarations: [
        MedicalCheckComponent,
    ],
    exports: [
        MedicalCheckComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalCheckRoutingModule,
    ]
})

export class MedicalCheckModule{

}
