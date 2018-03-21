import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialPurchaseListRoutingModule }      from './material-purchase-list.routing.module';

import { MaterialPurchaseListComponent }          from './material-purchase-list.component';

@NgModule({
    declarations: [
        MaterialPurchaseListComponent,
    ],
    exports: [
        MaterialPurchaseListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialPurchaseListRoutingModule,
    ]
})

export class MaterialPurchaseListModule{

}
