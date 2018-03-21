import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalPurchaseListRoutingModule }       from './medical-purchase-list.routing.module';

import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';

@NgModule({
    declarations: [
        MedicalPurchaseListComponent,
    ],
    exports: [
        MedicalPurchaseListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalPurchaseListRoutingModule,
    ]
})

export class MedicalPurchaseListModule{

}
