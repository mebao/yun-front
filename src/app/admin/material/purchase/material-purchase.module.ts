import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

import { NgZorroAntdModule }                      from 'ng-zorro-antd';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialPurchaseRoutingModule }          from './material-purchase.routing.module';

import { MaterialPurchaseComponent }              from './material-purchase.component';
import { MaterialPurchaseListComponent }          from './material-purchase-list.component';

@NgModule({
    declarations: [
        MaterialPurchaseComponent,
        MaterialPurchaseListComponent,
    ],
    exports: [
        MaterialPurchaseComponent,
        MaterialPurchaseListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        NavModule,
        AngCommonModule,
        MaterialPurchaseRoutingModule,
    ]
})

export class MaterialPurchaseModule{

}
