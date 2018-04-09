import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalHasRoutingModule }                from './medical-has.routing.module';

import { MedicalHasComponent }                    from './medical-has.component';
import { MedicalHasListComponent }                from './medical-has-list.component';

@NgModule({
    declarations: [
        MedicalHasComponent,
        MedicalHasListComponent,
    ],
    exports: [
        MedicalHasComponent,
        MedicalHasListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalHasRoutingModule,
    ]
})

export class MedicalHasModule{

}
