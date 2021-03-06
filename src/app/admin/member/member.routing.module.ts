import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';

import { AuthGuardRole }          from './../auth-guard-role.service';

import { MemberComponent }        from './member.component';
import { MemberListComponent }    from './member-list.component';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MemberComponent,
        },
        {
            path: 'list',
            canActivate: [AuthGuardRole],
            component: MemberListComponent,
        }
    ])]
})

export class MemberRoutingModule{

}
