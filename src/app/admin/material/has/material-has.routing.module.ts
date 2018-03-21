import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialHasComponent }                   from './material-has.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialHasComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialHasRoutingModule{

}
