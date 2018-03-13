import { NgModule }               from '@angular/core';
import { RouterModule }           from '@angular/router';

import { AuthGuardRole }          from './../auth-guard-role.service';

import { MemberComponent }        from './member.component';

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forChild([
        {
            path: '',
            canActivate: [AuthGuardRole],
            component: MemberComponent,
        }
    ])]
})

export class MemberRoutingModule{
    
}
