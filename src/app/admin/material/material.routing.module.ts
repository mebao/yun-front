import { NgModule }                       from '@angular/core';
import { RouterModule }                   from '@angular/router';

import { AuthGuardRole }                  from '../auth-guard-role.service';

import { MaterialComponent }              from './material.component';
import { MaterialListComponent }          from './material-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'checkList',
            loadChildren: './check-list/material-check-list.module#MaterialCheckListModule',
        },
        {
            path: 'check',
            loadChildren: './check/material-check.module#MaterialCheckModule',
        },
        {
            path: 'hasList',
            loadChildren: './has-list/material-has-list.module#MaterialHasListModule',
        },
        {
            path: 'has',
            loadChildren: './has/material-has.module#MaterialHasModule',
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MaterialListComponent,
        },
        {
            path: 'lostList',
            loadChildren: './lost-list/material-lost-list.module#MaterialLostListModule',
        },
        {
            path: 'lost',
            loadChildren: './lost/material-lost.module#MaterialLostModule',
        },
        {
            path: 'purchaseInfo',
            loadChildren: './purchase-info/material-purchase-info.module#MaterialPurchaseInfoModule',
        },
        {
            path: 'purchaseList',
            loadChildren: './purchase-list/material-purchase-list.module#MaterialPurchaseListModule',
        },
        {
            path: 'purchase',
            loadChildren: './purchase/material-purchase.module#MaterialPurchaseModule',
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
