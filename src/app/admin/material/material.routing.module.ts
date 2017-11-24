import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

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
    imports: [RouterModule.forChild([
        {
            path: 'checkList',
            canActivate: [AuthGuardRole],
            component: MaterialCheckListComponent,
        },
        {
            path: 'check',
            canActivate: [AuthGuardRole],
            component: MaterialCheckComponent,
        },
        {
            path: 'hasList',
            canActivate: [AuthGuardRole],
            component: MaterialHasListComponent,
        },
        {
            path: 'has',
            canActivate: [AuthGuardRole],
            component: MaterialHasComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MaterialListComponent,
        },
        {
            path: 'lostList',
            canActivate: [AuthGuardRole],
            component: MaterialLostListComponent,
        },
        {
            path: 'lost',
            canActivate: [AuthGuardRole],
            component: MaterialLostComponent,
        },
        {
            path: 'purchaseInfo',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseInfoComponent,
        },
        {
            path: 'purchaseList',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseListComponent,
        },
        {
            path: 'purchase',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseComponent,
        },
        {
            path: 'index',
            canActivate: [AuthGuardRole],
            component: MaterialComponent,
        }
    ])],
    exports: [RouterModule]
})

export class MaterialRoutingModule{

}
