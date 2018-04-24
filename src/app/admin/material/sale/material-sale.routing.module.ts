import { NgModule }                             from '@angular/core';
import { RouterModule }                         from '@angular/router';

import { AuthGuardRole }                        from '../../auth-guard-role.service';


import { MaterialSaleComponent }                from './material-sale.component';
import { MaterialSaleListComponent }           from './material-sale-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialSaleComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MaterialSaleListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialSaleRoutingModule{

}
