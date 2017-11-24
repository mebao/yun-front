import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../nav/nav.module';

//common
import { AngCommonModule }                      from '../../common/ang-common.module';

import { PrescriptRoutingModule }               from './prescript.routing.module';

import { PrescriptBackListComponent }           from './prescript-back-list.component';
import { PrescriptListComponent }               from './prescript-list.component';
import { PrescriptSaleListComponent }           from './prescript-sale-list.component';
import { PrescriptSaleComponent }               from './prescript-sale.component';

@NgModule({
    declarations: [
        PrescriptBackListComponent,
        PrescriptListComponent,
        PrescriptSaleListComponent,
        PrescriptSaleComponent,
    ],
    exports: [
        PrescriptBackListComponent,
        PrescriptListComponent,
        PrescriptSaleListComponent,
        PrescriptSaleComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptRoutingModule,
    ]
})

export class PrescriptModule{

}
