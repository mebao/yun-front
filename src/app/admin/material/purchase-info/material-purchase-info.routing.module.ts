import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialPurchaseInfoComponent }          from './material-purchase-info.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialPurchaseInfoComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialPurchaseInfoRoutingModule{

}
