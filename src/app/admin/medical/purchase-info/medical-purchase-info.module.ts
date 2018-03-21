import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalPurchaseInfoRoutingModule }       from './medical-purchase-info.routing.module';

import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';

@NgModule({
    declarations: [
        MedicalPurchaseInfoComponent,
    ],
    exports: [
        MedicalPurchaseInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalPurchaseInfoRoutingModule,
    ]
})

export class MedicalPurchaseInfoModule{

}
