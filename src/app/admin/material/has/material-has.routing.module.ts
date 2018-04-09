import { NgModule }                               from '@angular/core';
import { RouterModule }                           from '@angular/router';

import { AuthGuardRole }                          from '../../auth-guard-role.service';

import { MaterialHasComponent }                   from './material-has.component';
import { MaterialHasListComponent }               from './material-has-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MaterialHasComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MaterialHasListComponent,
        },
    ])],
    exports: [RouterModule]
})

export class MaterialHasRoutingModule{

}
