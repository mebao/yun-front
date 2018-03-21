import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialPurchaseComponent }              from './material-purchase.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialPurchaseRoutingModule{

}
