import { NgModule }                    from '@angular/core';
import { RouterModule }                from '@angular/router';

import { AuthGuardRole }               from './../auth-guard-role.service';

import { SetupInspectListComponent }   from './inspect-list.component'

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: SetupInspectListComponent
        }
    ])]
})

export class InspectListRoutingModule{

}
