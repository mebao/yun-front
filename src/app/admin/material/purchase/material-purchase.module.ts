import { NgModule }                               from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { FormsModule }                            from '@angular/forms';

//nav
import { NavModule }                              from '../../nav/nav.module';

//common
import { AngCommonModule }                        from '../../../common/ang-common.module';

import { MaterialPurchaseRoutingModule }          from './material-purchase.routing.module';

import { MaterialPurchaseComponent }              from './material-purchase.component';

@NgModule({
    declarations: [
        MaterialPurchaseComponent,
    ],
    exports: [
        MaterialPurchaseComponent,
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
