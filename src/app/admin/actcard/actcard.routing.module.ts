import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardRole } from './../auth-guard-role.service';

import { Actcard } from './actcard';
import { ActcardList }  from './actcard-list';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: Actcard,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: ActcardList,
        }
    ])]
})

export class ActcardRoutingModule{

}
