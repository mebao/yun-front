import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalCheckListRoutingModule }          from './medical-check-list.routing.module';

import { MedicalCheckListComponent }              from './medical-check-list.component';

@NgModule({
    declarations: [
        MedicalCheckListComponent,
    ],
    exports: [
        MedicalCheckListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalCheckListRoutingModule,
    ]
})

export class MedicalCheckListModule{

}
