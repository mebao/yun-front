import { NgModule }                   from '@angular/core';
import { RouterModule }               from '@angular/router';

import { AuthGuardRole }              from './../auth-guard-role.service';

import { SetupInspectComponent }      from './inspect.component';
import { SetupInspectListComponent }  from './inspect-list.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: SetupInspectComponent
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: SetupInspectListComponent
        }
    ])]
})

export class InspectRoutingModule{

}
