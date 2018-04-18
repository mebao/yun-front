import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { PrescriptSaleRoutingModule }           from './prescript-sale.routing.module';

import { PrescriptSaleComponent }               from './prescript-sale.component';
import { PrescriptSaleListComponent }           from './prescript-sale-list.component';

@NgModule({
    declarations: [
        PrescriptSaleComponent,
        PrescriptSaleListComponent,
    ],
    exports: [
        PrescriptSaleComponent,
        PrescriptSaleListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        PrescriptSaleRoutingModule,
    ]
})

export class PrescriptSaleModule{

}
