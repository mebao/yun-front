import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../nav/nav.module';

//common
import { AngCommonModule }                        from '../../common/ang-common.module';

import { MedicalRoutingModule }                   from './medical.routing.module';

import { MedicalComponent }                       from './medical.component';
import { MedicalListComponent }                   from './medical-list.component';

@NgModule({
    declarations: [
        MedicalComponent,
        MedicalListComponent,
    ],
    exports: [
        MedicalComponent,
        MedicalListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalRoutingModule,
    ]
})

export class MedicalModule{

}
