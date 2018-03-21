import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalLostListRoutingModule }           from './medical-lost-list.routing.module';

import { MedicalLostListComponent }               from './medical-lost-list.component';

@NgModule({
    declarations: [
        MedicalLostListComponent,
    ],
    exports: [
        MedicalLostListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalLostListRoutingModule,
    ]
})

export class MedicalLostListModule{

}
