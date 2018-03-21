import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalLostRoutingModule }               from './medical-lost.routing.module';

import { MedicalLostComponent }                   from './medical-lost.component';

@NgModule({
    declarations: [
        MedicalLostComponent,
    ],
    exports: [
        MedicalLostComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalLostRoutingModule,
    ]
})

export class MedicalLostModule{

}
