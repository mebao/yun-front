import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalPurchaseRoutingModule }           from './medical-purchase.routing.module';

import { MedicalPurchaseComponent }               from './medical-purchase.component';

@NgModule({
    declarations: [
        MedicalPurchaseComponent,
    ],
    exports: [
        MedicalPurchaseComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalPurchaseRoutingModule,
    ]
})

export class MedicalPurchaseModule{

}
