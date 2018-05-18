import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';

import { AuthGuardRole }          from './../auth-guard-role.service';

import { Mout }                   from './mout';
import { MoutList }               from './mout-list';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            // canActivate: [AuthGuardRole],
            component: Mout,
        },
        {
            path: 'list',
            // canActivate: [AuthGuardRole],
            component: MoutList,
        }
    ])]
})

export class MoutRoutingModule{

}
