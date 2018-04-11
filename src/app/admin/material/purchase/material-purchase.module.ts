import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialPurchaseRoutingModule }          from './material-purchase.routing.module';

import { MaterialPurchaseComponent }              from './material-purchase.component';
import { MaterialPurchaseListComponent }          from './material-purchase-list.component';
import { MaterialPurchaseInfoComponent }          from './material-purchase-info.component';

@NgModule({
    declarations: [
        MaterialPurchaseComponent,
        MaterialPurchaseListComponent,
        MaterialPurchaseInfoComponent,
    ],
    exports: [
        MaterialPurchaseComponent,
        MaterialPurchaseListComponent,
        MaterialPurchaseInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialPurchaseRoutingModule,
    ]
})

export class MaterialPurchaseModule{

}
