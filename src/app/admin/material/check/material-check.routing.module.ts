import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialCheckComponent }                 from './material-check.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialCheckComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialCheckRoutingModule{

}
