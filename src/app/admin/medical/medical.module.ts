import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../nav/nav.module';

//common
import { AngCommonModule }                        from '../../common/ang-common.module';

import { MedicalRoutingModule }                   from './medical.routing.module';

import { MedicalCheckListComponent }              from './medical-check-list.component';
import { MedicalCheckComponent }                  from './medical-check.component';
import { MedicalHasListComponent }                from './medical-has-list.component';
import { MedicalHasComponent }                    from './medical-has.component';
import { MedicalListComponent }                   from './medical-list.component';
import { MedicalLostListComponent }               from './medical-lost-list.component';
import { MedicalLostComponent }                   from './medical-lost.component';
import { MedicalPurchaseInfoComponent }           from './medical-purchase-info.component';
import { MedicalPurchaseListComponent }           from './medical-purchase-list.component';
import { MedicalPurchaseComponent }               from './medical-purchase.component';
import { MedicalSupplierListComponent }           from './medical-supplier-list.component';
import { MedicalSupplierComponent }               from './medical-supplier.component';
import { MedicalComponent }                       from './medical.component';

@NgModule({
    declarations: [
        MedicalCheckListComponent,
        MedicalCheckComponent,
        MedicalHasListComponent,
        MedicalHasComponent,
        MedicalListComponent,
        MedicalLostListComponent,
        MedicalLostComponent,
        MedicalPurchaseInfoComponent,
        MedicalPurchaseListComponent,
        MedicalPurchaseComponent,
        MedicalSupplierListComponent,
        MedicalSupplierComponent,
        MedicalComponent,
    ],
    exports: [
        MedicalCheckListComponent,
        MedicalCheckComponent,
        MedicalHasListComponent,
        MedicalHasComponent,
        MedicalListComponent,
        MedicalLostListComponent,
        MedicalLostComponent,
        MedicalPurchaseInfoComponent,
        MedicalPurchaseListComponent,
        MedicalPurchaseComponent,
        MedicalSupplierListComponent,
        MedicalSupplierComponent,
        MedicalComponent,
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
