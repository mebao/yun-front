import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptSaleListRoutingModule }       from './prescript-sale-list.routing.module';

import { PrescriptSaleListComponent }           from './prescript-sale-list.component';

@NgModule({
    declarations: [
        PrescriptSaleListComponent,
    ],
    exports: [
        PrescriptSaleListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        PrescriptSaleListRoutingModule,
    ]
})

export class PrescriptSaleListModule{

}
