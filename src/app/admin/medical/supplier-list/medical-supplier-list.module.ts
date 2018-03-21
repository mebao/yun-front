import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalSupplierListRoutingModule }       from './medical-supplier-list.routing.module';

import { MedicalSupplierListComponent }           from './medical-supplier-list.component';

@NgModule({
    declarations: [
        MedicalSupplierListComponent,
    ],
    exports: [
        MedicalSupplierListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalSupplierListRoutingModule,
    ]
})

export class MedicalSupplierListModule{

}
