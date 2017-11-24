import { NgModule }                                     from '@angular/core';
import { CommonModule }                   from '@angular/common';
import { FormsModule }                    from '@angular/forms';

//nav
import { NavModule }                      from '../nav/nav.module';

//common
import { AngCommonModule }                from '../../common/ang-common.module';

import { MaterialRoutingModule }          from './material.routing.module';

import { MaterialCheckListComponent }     from './material-check-list.component';
import { MaterialCheckComponent }         from './material-check.component';
import { MaterialHasListComponent }       from './material-has-list.component';
import { MaterialHasComponent }           from './material-has.component';
import { MaterialListComponent }          from './material-list.component';
import { MaterialLostListComponent }      from './material-lost-list.component';
import { MaterialLostComponent }          from './material-lost.component';
import { MaterialPurchaseInfoComponent }  from './material-purchase-info.component';
import { MaterialPurchaseListComponent }  from './material-purchase-list.component';
import { MaterialPurchaseComponent }      from './material-purchase.component';
import { MaterialComponent }              from './material.component';

@NgModule({
    declarations: [
        MaterialCheckListComponent,
        MaterialCheckComponent,
        MaterialHasListComponent,
        MaterialHasComponent,
        MaterialListComponent,
        MaterialLostListComponent,
        MaterialLostComponent,
        MaterialPurchaseInfoComponent,
        MaterialPurchaseListComponent,
        MaterialPurchaseComponent,
        MaterialComponent,
    ],
    exports: [
        MaterialCheckListComponent,
        MaterialCheckComponent,
        MaterialHasListComponent,
        MaterialHasComponent,
        MaterialListComponent,
        MaterialLostListComponent,
        MaterialLostComponent,
        MaterialPurchaseInfoComponent,
        MaterialPurchaseListComponent,
        MaterialPurchaseComponent,
        MaterialComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NavModule,
        AngCommonModule,
        MaterialRoutingModule,
    ]
})

export class MaterialModule{
    
}
