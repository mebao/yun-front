import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MedicalSupplierRoutingModule }           from './medical-supplier.routing.module';

import { MedicalSupplierComponent }               from './medical-supplier.component';

@NgModule({
    declarations: [
        MedicalSupplierComponent,
    ],
    exports: [
        MedicalSupplierComponent,
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
