import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalSupplierRoutingModule }           from './medical-supplier.routing.module';

import { MedicalSupplierComponent }               from './medical-supplier.component';
import { MedicalSupplierListComponent }           from './medical-supplier-list.component';

@NgModule({
    declarations: [
        MedicalSupplierComponent,
        MedicalSupplierListComponent,
    ],
    exports: [
        MedicalSupplierComponent,
        MedicalSupplierListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MedicalSupplierRoutingModule,
    ]
})

export class MedicalSupplierModule{

}
