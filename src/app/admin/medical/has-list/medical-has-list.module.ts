import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalHasListRoutingModule }            from './medical-has-list.routing.module';

import { MedicalHasListComponent }                from './medical-has-list.component';

@NgModule({
    declarations: [
        MedicalHasListComponent,
    ],
    exports: [
        MedicalHasListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalHasListRoutingModule,
    ]
})

export class MedicalHasListModule{

}
