import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialLostComponent }                  from './material-lost.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialLostComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialLostRoutingModule{

}
