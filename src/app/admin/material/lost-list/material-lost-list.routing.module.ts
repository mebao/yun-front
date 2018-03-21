import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialLostListComponent }              from './material-lost-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialLostListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialLostListRoutingModule{

}
