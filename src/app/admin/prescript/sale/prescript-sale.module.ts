import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptSaleRoutingModule }           from './prescript-sale.routing.module';

import { PrescriptSaleComponent }               from './prescript-sale.component';

@NgModule({
    declarations: [
        PrescriptSaleComponent,
    ],
    exports: [
        PrescriptSaleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptSaleRoutingModule,
    ]
})

export class PrescriptSaleModule{

}
