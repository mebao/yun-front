import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialHasListComponent }               from './material-has-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialHasListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialHasListRoutingModule{

}
