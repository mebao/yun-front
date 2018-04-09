import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';

import { AuthGuardRole }                from './../auth-guard-role.service';

import { ChildListComponent }           from './child-list.component';
import { ChildInfoComponent }           from './child-info.component';

@NgModule({
    exports: [
        RouterModule,
    ],
    imports: [RouterModule.forChild([
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: ChildListComponent
        },
        {
            path: 'info',
            canActivate: [AuthGuardRole],
            component: ChildInfoComponent
        }
    ])]
})

export class ChildRoutingModule{

}
