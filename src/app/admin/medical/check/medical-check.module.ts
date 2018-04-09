import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalCheckRoutingModule }              from './medical-check.routing.module';

import { MedicalCheckComponent }                  from './medical-check.component';
import { MedicalCheckListComponent }              from './medical-check-list.component';

@NgModule({
    declarations: [
        MedicalCheckComponent,
        MedicalCheckListComponent,
    ],
    exports: [
        MedicalCheckComponent,
        MedicalCheckListComponent,
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
