import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalPurchaseRoutingModule }           from './medical-purchase.routing.module';

import { MedicalPurchaseComponent }               from './medical-purchase.component';
import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';
import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';

@NgModule({
    declarations: [
        MedicalPurchaseComponent,
        MedicalPurchaseListComponent,
        MedicalPurchaseInfoComponent,
    ],
    exports: [
        MedicalPurchaseComponent,
        MedicalPurchaseListComponent,
        MedicalPurchaseInfoComponent,
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
