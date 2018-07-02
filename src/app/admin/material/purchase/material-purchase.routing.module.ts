import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialPurchaseComponent }              from './material-purchase.component';
import { MaterialPurchaseListComponent }          from './material-purchase-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialPurchaseRoutingModule{

}
