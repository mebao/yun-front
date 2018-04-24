import { NgModule }                             from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { FormsModule }                          from '@angular/forms';

import { NgZorroAntdModule }                    from 'ng-zorro-antd';

//nav
import { NavModule }                            from '../../nav/nav.module';

//common
import { AngCommonModule }                      from '../../../common/ang-common.module';

import { MaterialSaleRoutingModule }            from './material-sale.routing.module';

import { MaterialSaleComponent }                from './material-sale.component';
import { MaterialSaleListComponent }            from './material-sale-list.component';

@NgModule({
    declarations: [
        MaterialSaleComponent,
        MaterialSaleListComponent,
    ],
    exports: [
        MaterialSaleComponent,
        MaterialSaleListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MaterialSaleRoutingModule,
    ]
})

export class MaterialSaleModule{

}
