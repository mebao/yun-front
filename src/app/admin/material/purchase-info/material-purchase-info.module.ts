import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialPurchaseInfoRoutingModule }      from './material-purchase-info.routing.module';

import { MaterialPurchaseInfoComponent }          from './material-purchase-info.component';

@NgModule({
    declarations: [
        MaterialPurchaseInfoComponent,
    ],
    exports: [
        MaterialPurchaseInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialPurchaseInfoRoutingModule,
    ]
})

export class MaterialPurchaseInfoModule{

}
