import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalListRoutingModule }               from './medical-list.routing.module';

import { MedicalListComponent }                   from './medical-list.component';

@NgModule({
    declarations: [
        MedicalListComponent,
    ],
    exports: [
        MedicalListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalListRoutingModule,
    ]
})

export class MedicalListModule{

}
